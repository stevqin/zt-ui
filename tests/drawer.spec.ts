import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('ZtDrawer', () => {
  it('moves focus into the teleported panel when opened', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: '焦点测试' },
    })

    await nextTick()
    expect(document.activeElement).toBe(document.querySelector('.zt-drawer__close'))
  })

  it('maps placement and size to the correct panel axis', async () => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, size: 460 },
    })
    const overlay = document.querySelector<HTMLElement>('.zt-drawer')!
    const panel = document.querySelector<HTMLElement>('.zt-drawer__panel')!

    expect(overlay.classList.contains('zt-drawer--right')).toBe(true)
    expect(panel.style.width).toBe('460px')
    expect(panel.style.height).toBe('')

    for (const placement of ['left', 'top', 'bottom'] as const) {
      await wrapper.setProps({ placement })
      expect(overlay.classList.contains(`zt-drawer--${placement}`)).toBe(true)
    }
    expect(panel.style.width).toBe('')
    expect(panel.style.height).toBe('460px')
  })

  it('renders an accessible dialog and custom slots', () => {
    mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: '筛选条件', showFooter: true },
      slots: {
        default: '<p class="drawer-content">筛选内容</p>',
        footer: '<div class="drawer-footer">自定义操作</div>',
      },
    })

    const panel = document.querySelector('.zt-drawer__panel')!
    expect(panel.getAttribute('role')).toBe('dialog')
    expect(panel.getAttribute('aria-modal')).toBe('true')
    expect(document.querySelector('.drawer-content')?.textContent).toBe('筛选内容')
    expect(document.querySelector('.drawer-footer')?.textContent).toBe('自定义操作')
  })

  it('closes with the close-button reason', async () => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true },
    })
    ;(document.querySelector('.zt-drawer__close') as HTMLButtonElement).click()
    await Promise.resolve()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
