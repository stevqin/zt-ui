import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'

describe('Select empty placeholder', () => {
  it('moves the open dropdown below the input when selected tags increase the control height', async () => {
    const observed = new Set<Element>()
    let resized: (() => void) | undefined
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resized = callback }
      observe(element: Element) { observed.add(element) }
      disconnect() { observed.clear() }
    })
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { multiple: true, filterable: true } })
    const control = wrapper.get('.zt-select__control').element
    let height = 34
    vi.spyOn(control, 'getBoundingClientRect').mockImplementation(() => ({
      top: 10, bottom: 10 + height, left: 0, right: 240, width: 240, height,
      x: 0, y: 10, toJSON: () => ({}),
    }))
    try {
      await wrapper.get('input').trigger('click')
      await nextTick()
      const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      expect(dropdown.style.top).toBe('44px')
      height = 90
      if (observed.has(control)) resized!()
      await nextTick()
      expect(dropdown.style.top).toBe('100px')
    } finally {
      wrapper.unmount()
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
    }
  })
  it.each([{ filterable: true }, { remote: true }])('leaves selected tags without an inline search hint: %j', async searchProps => {
    const wrapper = mount(ZtSelect, {
      props: {
        ...searchProps,
        multiple: true,
        modelValue: [1, 2],
        placeholder: '请选择城市',
        options: [{ label: '杭州', value: 1 }, { label: '上海', value: 2 }],
      },
    })
    expect(wrapper.get('input').attributes('placeholder')).toBeUndefined()
    await wrapper.setProps({ collapseTags: true })
    expect(wrapper.get('input').attributes('placeholder')).toBeUndefined()
    await wrapper.setProps({ modelValue: [] })
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择城市')
    wrapper.unmount()
  })
  it.each(['', null, undefined])('uses an input placeholder for %s without a clear action', modelValue => {
    const wrapper = mount(ZtSelect, { props: { modelValue, clearable: true, placeholder: '请选择城市', options: [{ label: '杭州', value: 'hz' }] } })
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择城市')
    expect(wrapper.get('input').element.value).toBe('')
    expect(wrapper.classes()).not.toContain('has-selection')
    expect(wrapper.find('.zt-select__clear').exists()).toBe(false)
    wrapper.unmount()
  })
  it.each(['', 0])('preserves an explicitly supplied option with value %s', modelValue => {
    const wrapper = mount(ZtSelect, { props: { modelValue, options: [{ label: '有效选项', value: modelValue }] } })
    expect(wrapper.get('input').element.value).toBe('有效选项')
    expect(wrapper.classes()).toContain('has-selection')
    wrapper.unmount()
  })
})
