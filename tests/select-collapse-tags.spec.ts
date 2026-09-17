import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'

const options = ['甲', '乙', '丙', '丁'].map((label, value) => ({ label, value }))
describe('Select collapsed tags', () => {
  it('keeps all tags by default, then responds to limits without changing selection', async () => {
    const wrapper = mount(ZtSelect, { props: { multiple: true, options, modelValue: [0, 1, 2, 3] } })
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(4)
    await wrapper.setProps({ collapseTags: true })
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(1)
    expect(wrapper.get('.zt-select__tag-count').text()).toBe('+3')
    await wrapper.setProps({ maxCollapseTags: 2 })
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(2)
    expect(wrapper.get('.zt-select__tag-count').text()).toBe('+2')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wrapper.get('.zt-select__tag-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[[1, 2, 3]]])
    await wrapper.setProps({ modelValue: [2, 3] })
    expect(wrapper.find('.zt-select__tag-count').exists()).toBe(false)
    wrapper.unmount()
  })
  it('normalizes invalid limits and leaves single selection unchanged', async () => {
    const wrapper = mount(ZtSelect, { props: { multiple: true, options, modelValue: [0, 1, 2], collapseTags: true, maxCollapseTags: 0 } })
    expect(wrapper.get('.zt-select__tag-count').text()).toBe('+2')
    await wrapper.setProps({ maxCollapseTags: 2.9 })
    expect(wrapper.get('.zt-select__tag-count').text()).toBe('+1')
    await wrapper.setProps({ maxCollapseTags: NaN })
    expect(wrapper.get('.zt-select__tag-count').text()).toBe('+2')
    await wrapper.setProps({ multiple: false, modelValue: 0 })
    expect(wrapper.find('.zt-select__tag-count').exists()).toBe(false)
    wrapper.unmount()
  })
})
