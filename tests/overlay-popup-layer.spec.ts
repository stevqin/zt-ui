import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtDrawer as ZtAlertDrawer } from '@ztechjs/zt-alert'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtDatePicker from '../src/components/date-picker/ZtDatePicker.vue'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'

describe('popup layers in imperative feedback drawers', () => {
  it('keeps SelectBox and its nested popup inside a real Drawer with default focus trapping', async () => {
    vi.useFakeTimers()
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('zt-drawer__panel')) return new DOMRect(640, 0, 320, 800)
      if (this.classList.contains('zt-select-box')) return new DOMRect(680, 100, 240, 34)
      return new DOMRect(0, 0, 300, 300)
    })
    const rects = vi.spyOn(HTMLElement.prototype, 'getClientRects').mockImplementation(function (this: HTMLElement) {
      return (this.closest('[hidden]') ? [] : [new DOMRect(0, 0, 100, 30)]) as unknown as DOMRectList
    })
    const content = document.createElement('div')
    const wrapper = mount(ZtSelectBox, { attachTo: content, props: { options: [{ value: 'a', label: 'Alpha' }] } })
    const drawer = ZtAlertDrawer.open({ content, zIndex: 6400 })
    try {
      await vi.runAllTimersAsync()
      await wrapper.get('.zt-select-box__trigger').trigger('click')
      await flushPromises()
      const popup = document.querySelector<HTMLElement>('.zt-select-box__popup')!
      expect(popup).not.toBeNull()
      expect(document.activeElement?.getAttribute('aria-label')).toBe('搜索选项')
      expect(content.closest('.zt-drawer__panel')?.contains(popup)).toBe(true)
      expect(popup.style.position).toBe('absolute')
      expect(popup.style.left).toBe('8px')
      expect(popup.style.top).toBe('134px')
      expect(popup.style.width).toBe('304px')
      document.querySelector<HTMLElement>('.zt-select-box-panel__mode')!.click()
      await flushPromises()
      const separator = document.querySelector<HTMLInputElement>('.zt-select-box-panel__separator input')!
      separator.focus(); separator.click(); await flushPromises()
      const nested = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      nested.tabIndex = -1; nested.focus(); await flushPromises()
      expect(document.activeElement).toBe(nested)
      expect(content.closest('.zt-drawer__panel')?.contains(nested)).toBe(true)
      expect(document.querySelector('.zt-select-box__popup')).toBe(popup)
      document.querySelector<HTMLElement>('[role="option"]')!.click(); await flushPromises()
      document.querySelector<HTMLElement>('.zt-select-box-panel__cancel')!.click(); await flushPromises()
      expect(document.querySelector('.zt-select-box__popup')).toBeNull()
      expect(document.activeElement).toBe(wrapper.get('.zt-select-box__trigger').element)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally {
      wrapper.unmount()
      await drawer.close(); await vi.runAllTimersAsync(); await drawer.closed
      content.remove(); rects.mockRestore(); bounds.mockRestore(); vi.useRealTimers()
    }
  })

  it.each([
    { name: 'Select', component: ZtSelect, popupSelector: '.zt-select__dropdown' },
    { name: 'DatePicker', component: ZtDatePicker, popupSelector: '.zt-date-picker__panel' },
  ])('keeps $name above a real zt-alert Drawer with a custom layer', async ({ component, popupSelector }) => {
    vi.useFakeTimers()
    const content = document.createElement('div')
    const wrapper = mount(component, { attachTo: content })
    const drawer = ZtAlertDrawer.open({ content, zIndex: 6400, autoFocus: false })
    try {
      await vi.runAllTimersAsync()
      await wrapper.get('input').trigger('click')
      await nextTick()
      const overlay = content.closest<HTMLElement>('.zt-drawer')!
      const popup = document.querySelector<HTMLElement>(popupSelector)!
      expect(overlay.contains(wrapper.element)).toBe(true)
      expect(Number(overlay.style.zIndex)).toBeGreaterThanOrEqual(6400)
      expect(popup.parentElement).toBe(component === ZtSelect ? content.closest('.zt-drawer__panel') : document.body)
      expect(Number(popup.style.zIndex)).toBe(Number(overlay.style.zIndex) + 1)

      overlay.style.zIndex = '7200'
      window.dispatchEvent(new Event('resize'))
      await nextTick()
      expect(popup.style.zIndex).toBe('7201')
    } finally {
      wrapper.unmount()
      await drawer.close()
      await vi.runAllTimersAsync()
      await drawer.closed
      content.remove()
      vi.useRealTimers()
    }
  })
})
