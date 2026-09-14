import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import ZtModal from '../src/components/modal/ZtModal.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('ZtModal', () => {
  it('optionally renders a built-in fullscreen toggle and emits its state', async () => {
    const hidden = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true },
    })
    expect(document.querySelector('.zt-modal__fullscreen')).toBeNull()
    hidden.unmount()

    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, showFullscreenButton: true },
    })
    const button = document.querySelector<HTMLButtonElement>('.zt-modal__fullscreen')!
    expect(button.getAttribute('aria-pressed')).toBe('false')

    button.click()
    await nextTick()
    expect(document.querySelector('.zt-modal')?.classList.contains('zt-modal--fullscreen')).toBe(true)
    expect(button.getAttribute('aria-label')).toBe('退出全屏')
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(wrapper.emitted('update:fullscreen')?.[0]).toEqual([true])
    expect(wrapper.emitted('fullscreen-change')?.[0]).toEqual([true])
  })

  it('drags from the header, stays inside the viewport, and can reset position', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, draggable: true },
    })
    await nextTick()
    const modal = document.querySelector<HTMLElement>('.zt-modal')!
    const panel = document.querySelector<HTMLElement>('.zt-modal__panel')!
    const header = document.querySelector<HTMLElement>('.zt-modal__header')!
    panel.getBoundingClientRect = () => ({
      x: 100, y: 80, left: 100, top: 80, right: 620, bottom: 480,
      width: 520, height: 400, toJSON: () => ({}),
    })

    header.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, button: 0, pointerId: 1, clientX: 200, clientY: 120,
    }))
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 1, clientX: 260, clientY: 160,
    }))
    await nextTick()
    expect(modal.classList.contains('zt-modal--dragging')).toBe(true)
    expect(panel.style.transform).toBe('translate3d(60px, 40px, 0)')

    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 1, clientX: 2000, clientY: 2000,
    }))
    await nextTick()
    expect(panel.style.transform).toBe('translate3d(404px, 288px, 0)')
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
    await nextTick()
    expect(modal.classList.contains('zt-modal--dragging')).toBe(false)

    ;(wrapper.vm as any).resetPosition()
    await nextTick()
    expect(panel.style.transform).toBe('')
  })

  it('does not start dragging from header controls or while fullscreen', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        draggable: true,
        showFullscreenButton: true,
        fullscreen: true,
      },
    })
    await nextTick()
    const modal = document.querySelector<HTMLElement>('.zt-modal')!
    const header = document.querySelector<HTMLElement>('.zt-modal__header')!
    const fullscreen = document.querySelector<HTMLElement>('.zt-modal__fullscreen')!

    fullscreen.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, button: 0, pointerId: 2, clientX: 200, clientY: 120,
    }))
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 2, clientX: 260, clientY: 160,
    }))
    expect(modal.classList.contains('zt-modal--dragging')).toBe(false)

    header.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, button: 0, pointerId: 3, clientX: 200, clientY: 120,
    }))
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true, pointerId: 3, clientX: 260, clientY: 160,
    }))
    expect(modal.classList.contains('zt-modal--dragging')).toBe(false)
    expect(typeof (wrapper.vm as any).resetPosition).toBe('function')
  })

  it('moves focus into the teleported panel when opened', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, title: '焦点测试' },
    })

    await nextTick()
    expect(document.activeElement).toBe(document.querySelector('.zt-modal__close'))
  })

  it('renders an accessible teleported dialog with sizing variants', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: '编辑资料',
        width: 520,
        top: 48,
        fullscreen: false,
      },
      slots: { default: '<p class="content">正文</p>' },
    })

    const overlay = document.querySelector<HTMLElement>('.zt-modal')!
    const panel = document.querySelector<HTMLElement>('.zt-modal__panel')!
    expect(overlay).not.toBeNull()
    expect(panel.getAttribute('role')).toBe('dialog')
    expect(panel.getAttribute('aria-modal')).toBe('true')
    expect(panel.getAttribute('aria-labelledby')).toBeTruthy()
    expect(panel.style.width).toBe('520px')
    expect(overlay.style.paddingTop).toBe('48px')
    await wrapper.setProps({ fullscreen: true })
    expect(overlay.classList.contains('zt-modal--fullscreen')).toBe(true)
    expect(document.querySelector('.content')?.textContent).toBe('正文')
    wrapper.unmount()
  })

  it('emits close reasons and keeps confirm owner-controlled', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, showFooter: true },
    })

    await (document.querySelector('.zt-modal__confirm') as HTMLButtonElement).click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    ;(document.querySelector('.zt-modal__cancel') as HTMLButtonElement).click()
    await Promise.resolve()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0]).toEqual(['cancel'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('supports title/footer slots and exposed controls', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: false, showFooter: true },
      slots: {
        title: '<strong class="custom-title">自定义标题</strong>',
        footer: '<div class="custom-footer">自定义底部</div>',
      },
    })

    ;(wrapper.vm as any).open()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    await wrapper.setProps({ modelValue: true })
    expect(document.querySelector('.custom-title')?.textContent).toBe('自定义标题')
    expect(document.querySelector('.custom-footer')?.textContent).toBe('自定义底部')
    expect(typeof (wrapper.vm as any).close).toBe('function')
    expect(typeof (wrapper.vm as any).focus).toBe('function')
  })
})
