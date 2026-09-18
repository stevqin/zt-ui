import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtDatePicker from '../src/components/date-picker/ZtDatePicker.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  resetOverlayManager()
  document.body.innerHTML = ''
})

describe('ZtDrawer', () => {
  it.each([ZtSelect, ZtDatePicker])('keeps nested input popups above its renamed surface', async component => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, autoFocus: false, zIndex: 6400 },
      slots: { default: () => h(component) },
    })
    try {
      await nextTick()
      await wrapper.findComponent(component).get('input').trigger('click')
      await nextTick()
      const root = document.querySelector<HTMLElement>('.zt-drawer-surface')!
      const popup = document.querySelector<HTMLElement>('.zt-select__dropdown, .zt-date-picker__panel')!
      expect(popup.style.zIndex).toBe('6401')
      root.style.zIndex = '7200'
      window.dispatchEvent(new Event('resize'))
      await nextTick()
      expect(popup.style.zIndex).toBe('7201')
    } finally { wrapper.unmount() }
  })

  it('moves focus into the teleported panel when opened', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: '焦点测试' },
    })

    await nextTick()
    expect(document.activeElement).toBe(document.querySelector('.zt-drawer-surface__close'))
  })

  it('maps placement and size to the correct panel axis', async () => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body,
      props: { modelValue: true, size: 460 },
    })
    const overlay = document.querySelector<HTMLElement>('.zt-drawer-surface')!
    const panel = document.querySelector<HTMLElement>('.zt-drawer-surface__panel')!

    expect(overlay.classList.contains('zt-drawer-surface--right')).toBe(true)
    expect(panel.style.width).toBe('460px')
    expect(panel.style.height).toBe('')

    for (const placement of ['left', 'top', 'bottom'] as const) {
      await wrapper.setProps({ placement })
      expect(overlay.classList.contains(`zt-drawer-surface--${placement}`)).toBe(true)
    }
    expect(panel.style.width).toBe('')
    expect(panel.style.height).toBe('460px')
  })

  it('normalizes numeric strings and supports width and custom body layouts', async () => {
    const wrapper = mount(ZtDrawer, { attachTo: document.body, props: { modelValue: true, size: '760' } })
    const panel = document.querySelector<HTMLElement>('.zt-drawer-surface__panel')!
    expect(panel.style.width).toBe('760px')
    await wrapper.setProps({ width: '680', bodyScroll: false, bodyPadding: 12 })
    expect(panel.style.width).toBe('680px')
    const body = document.querySelector<HTMLElement>('.zt-drawer-surface__body')!
    expect(body.classList.contains('zt-drawer-surface__body--custom-scroll')).toBe(true)
    expect(body.style.padding).toBe('12px')
    await wrapper.setProps({ width: '80vw', bodyPadding: '12px 20px' })
    expect(panel.style.width).toBe('80vw')
    expect(body.style.padding).toBe('12px 20px')
    wrapper.unmount()
  })

  it('blocks escape, imperative close and confirm while loading or saving', async () => {
    const wrapper = mount(ZtDrawer, { attachTo: document.body, props: { modelValue: true, loading: true, loadingText: '读取权限', showFooter: true } })
    await nextTick()
    expect(document.querySelector('[role="status"]')?.textContent).toContain('读取权限')
    for (const state of [{ loading: true, confirmLoading: false }, { loading: false, confirmLoading: true }]) {
      await wrapper.setProps(state)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await wrapper.vm.close()
      ;(document.querySelector('.zt-drawer-surface__confirm') as HTMLButtonElement).click()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('confirm')).toBeUndefined()
    }
    await wrapper.setProps({ confirmLoading: false })
    ;(document.querySelector('.zt-drawer-surface__confirm') as HTMLButtonElement).click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    await wrapper.vm.close()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('supports responsive fullscreen width and releases the media listener', async () => {
    const listeners = new Set<() => void>()
    const media = { matches: true, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) }
    vi.stubGlobal('matchMedia', vi.fn(() => media))
    const wrapper = mount(ZtDrawer, { attachTo: document.body, props: { modelValue: true, fullscreenBelow: 768 } })
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767.98px)')
    expect(document.querySelector('.zt-drawer-surface--narrow')).not.toBeNull()
    media.matches = false
    listeners.forEach(fn => fn())
    await nextTick()
    expect(document.querySelector('.zt-drawer-surface--narrow')).toBeNull()
    wrapper.unmount()
    expect(listeners.size).toBe(0)
    vi.unstubAllGlobals()
  })

  it('supports Portal header/content slots and preserves guarded close and root attrs', async () => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body,
      attrs: { 'data-owner': 'permissions', class: 'custom-drawer' },
      props: { modelValue: true, subtitle: '选择可访问菜单', closeLabel: '关闭权限', beforeClose: () => false },
      slots: {
        'header-actions': ({ confirm }: any) => h('button', { class: 'header-action', onClick: confirm }, '保存'),
        content: ({ close }: any) => h('button', { class: 'custom-content', onClick: () => close('cancel') }, '取消'),
        footer: '<div class="custom-footer">页脚</div>',
      },
    })
    expect(document.querySelector('.zt-drawer-surface__heading')?.textContent).toContain('选择可访问菜单')
    expect(document.querySelector('.zt-drawer-surface__close')?.getAttribute('aria-label')).toBe('关闭权限')
    expect(document.querySelector('.custom-drawer')?.getAttribute('data-owner')).toBe('permissions')
    expect(document.querySelector('.custom-footer')).not.toBeNull()
    ;(document.querySelector('.header-action') as HTMLElement).click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    ;(document.querySelector('.custom-content') as HTMLElement).click()
    await Promise.resolve()
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
  })

  it('emits show and hide aliases after the enter and leave transitions', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ZtDrawer, { attachTo: document.body, props: { modelValue: true }, global: { stubs: { transition: false } } })
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('opened')).toHaveLength(1)
    await wrapper.setProps({ modelValue: false })
    await vi.runAllTimersAsync()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.emitted('closed')).toHaveLength(1)
    wrapper.unmount()
    vi.useRealTimers()
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

    const panel = document.querySelector('.zt-drawer-surface__panel')!
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
    ;(document.querySelector('.zt-drawer-surface__close') as HTMLButtonElement).click()
    await Promise.resolve()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
