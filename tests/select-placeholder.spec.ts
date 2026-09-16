import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'

describe('Select empty placeholder', () => {
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
