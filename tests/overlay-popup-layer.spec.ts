import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import ZtModal from '../src/components/modal/ZtModal.vue'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtDatePicker from '../src/components/date-picker/ZtDatePicker.vue'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const overlays = [
  { name: 'Drawer', component: ZtDrawer, selector: '.zt-drawer-surface' },
  { name: 'Modal', component: ZtModal, selector: '.zt-modal' },
]
const controls = [
  { name: 'Select', component: ZtSelect, trigger: '.zt-select__control', popup: '.zt-select__dropdown' },
  { name: 'SelectBox', component: ZtSelectBox, trigger: '.zt-select-box', popup: '.zt-select-box__popup' },
  { name: 'DatePicker', component: ZtDatePicker, trigger: '.zt-date-picker', popup: '.zt-date-picker__panel' },
]
afterEach(() => { resetOverlayManager(); vi.restoreAllMocks(); document.body.innerHTML = '' })

describe.each(overlays)('popup layers in local $name', overlay => {
  it.each(controls)('keeps $name body-teleported above the overlay after resize and scroll', async control => {
    let top = 100
    let left = 160
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.matches(control.trigger) ? new DOMRect(left, top, 240, 34) : new DOMRect(0, 0, 300, 200)
    })
    const wrapper = mount(overlay.component, {
      attachTo: document.body, props: { modelValue: true, zIndex: 6400, showHeader: false },
      slots: { default: () => h(control.component, { options: [{ value: 'a', label: 'Alpha' }] }) },
    })
    try {
      await flushPromises()
      const child = wrapper.findComponent(control.component)
      await child.get(control.name === 'SelectBox' ? '[role="combobox"]' : 'input').trigger('click')
      await flushPromises()
      const popup = document.querySelector<HTMLElement>(control.popup)!
      const layer = document.querySelector<HTMLElement>(overlay.selector)!
      expect(popup.parentElement).toBe(document.body)
      if (control.name !== 'DatePicker') expect(popup.style.position).toBe('fixed')
      expect(Number(popup.style.zIndex)).toBe(Number(layer.style.zIndex) + 1)
      expect(popup.style.top).toBe(control.name === 'DatePicker' ? '140px' : '134px')
      expect(popup.style.left).toBe('160px')
      top = 180; left = 200
      window.dispatchEvent(new Event('resize'))
      await flushPromises()
      expect(popup.style.top).toBe(control.name === 'DatePicker' ? '220px' : '214px')
      expect(popup.style.left).toBe('200px')
      top = 130
      layer.querySelector('section')!.dispatchEvent(new Event('scroll'))
      await flushPromises()
      expect(popup.style.top).toBe(control.name === 'DatePicker' ? '170px' : '164px')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally { wrapper.unmount() }
  })

  it.each(controls.filter(control => control.name !== 'SelectBox').flatMap(control =>
    [false, true].map(reverse => ({ ...control, reverse })),
  ))('returns from $name to the correct overlay sibling on Tab (reverse=$reverse)', async control => {
    const wrapper = mount(overlay.component, {
      attachTo: document.body, props: { modelValue: true, showHeader: false },
      slots: { default: () => [h('button', { class: 'before' }, 'Before'), h(control.component, {
        options: [{ value: 'a', label: 'Alpha' }],
      }), h('button', { class: 'after' }, 'After')] },
    })
    try {
      await flushPromises()
      await wrapper.findComponent(control.component).get('input').trigger('click')
      await flushPromises()
      const popup = document.querySelector<HTMLElement>(control.popup)!
      const focusable = [...popup.querySelectorAll<HTMLElement>('button:not([disabled]),[tabindex="0"]')]
        .filter(element => element.tabIndex >= 0)
      const edge = control.reverse ? focusable[0] : focusable.at(-1)
      const target = edge ?? popup
      if (!edge) popup.tabIndex = -1
      target.focus()
      await flushPromises()
      expect(document.activeElement).toBe(target)
      target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: control.reverse, bubbles: true, cancelable: true }))
      await flushPromises()
      expect(document.activeElement?.classList.contains(control.reverse ? 'before' : 'after')).toBe(true)
      expect(document.querySelector(control.popup)).toBeNull()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally { wrapper.unmount() }
  })

  it.each([false, true])('keeps nested SelectBox focus in its branch and returns to the overlay (reverse=%s)', async reverse => {
    const wrapper = mount(overlay.component, {
      attachTo: document.body, props: { modelValue: true, zIndex: 6400, showHeader: false },
      slots: { default: () => [h('button', { class: 'before' }, 'Before'), h(ZtSelectBox, {
        options: [{ value: 'a', label: 'Alpha' }],
      }), h('button', { class: 'after' }, 'After')] },
    })
    try {
      await flushPromises()
      const box = wrapper.findComponent(ZtSelectBox)
      await box.get('[role="combobox"]').trigger('click')
      await flushPromises()
      const popup = document.querySelector<HTMLElement>('.zt-select-box__popup')!
      expect(document.activeElement?.getAttribute('aria-label')).toBe('搜索选项')
      document.querySelector<HTMLElement>('.zt-select-box-panel__mode')!.click()
      await flushPromises()
      const separator = document.querySelector<HTMLInputElement>('.zt-select-box-panel__separator input')!
      separator.focus(); separator.click(); await flushPromises()
      const nested = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      expect(nested.parentElement).toBe(document.body)
      expect(Number(nested.style.zIndex)).toBeGreaterThan(Number(popup.style.zIndex))
      nested.tabIndex = -1; nested.focus(); await flushPromises()
      expect(document.activeElement).toBe(nested)
      nested.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: reverse, bubbles: true, cancelable: true }))
      await flushPromises()
      expect(document.querySelector('.zt-select__dropdown')).toBeNull()
      expect(document.querySelector('.zt-select-box__popup')).toBe(popup)
      expect(document.activeElement?.matches(reverse ? 'textarea' : '.zt-select-box-panel__mode')).toBe(true)
      const edge = document.querySelector<HTMLElement>(reverse ? 'textarea' : '.zt-select-box-panel__confirm')!
      edge.focus()
      edge.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: reverse, bubbles: true, cancelable: true }))
      await flushPromises()
      expect(document.activeElement?.classList.contains(reverse ? 'before' : 'after')).toBe(true)
      expect(document.querySelector('.zt-select-box__popup')).toBeNull()
      expect(box.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally { wrapper.unmount() }
  })
})
