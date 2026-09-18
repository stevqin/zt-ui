import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtDrawer as ZtAlertDrawer } from '@ztechjs/zt-alert'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtDatePicker from '../src/components/date-picker/ZtDatePicker.vue'

describe('popup layers in imperative feedback drawers', () => {
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
      expect(popup.parentElement).toBe(document.body)
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
