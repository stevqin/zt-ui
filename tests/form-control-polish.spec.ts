import { mount } from '@vue/test-utils'
import { h, ref, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtRadio, ZtRadioGroup, ZtConfigProvider, ZtInput, ZtPassword, ZtSelect, ZtTreeSelect, ZtCascader, ZtTimePicker } from '../src'

describe('radio group semantics', () => {
  it('accepts a bare segmented attribute and responds to boolean changes', async () => {
    const wrapper = mount({ components: { ZtRadioGroup }, template: '<ZtRadioGroup segmented />' })
    expect(wrapper.find('.zt-radio-group').classes()).toContain('zt-radio-group--segmented')
    const group = mount(ZtRadioGroup)
    expect(group.classes()).toContain('zt-radio-group--default')
    await group.setProps({ segmented: true })
    expect(group.classes()).toContain('zt-radio-group--segmented')
    await group.setProps({ segmented: false })
    expect(group.classes()).toContain('zt-radio-group--default')
    await group.setProps({ variant: 'segmented' })
    expect(group.classes()).toContain('zt-radio-group--default')
  })
  it('uses native focusable named inputs and preserves individually disabled choices', async () => {
    const wrapper = mount(ZtRadioGroup, {
      props: { modelValue: 'a', segmented: true, size: 'small', status: 'success' },
      slots: { default: () => [h(ZtRadio, { label: 'a' }), h(ZtRadio, { label: 'b', disabled: true }), h(ZtRadio, { label: 'c' })] },
    })
    const inputs = wrapper.findAll('input')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.classes()).toContain('zt-radio-group--segmented')
    expect(inputs.map(input => input.attributes('name'))).toEqual(Array(3).fill(inputs[0].attributes('name')))
    expect(inputs[0].attributes('tabindex')).toBeUndefined()
    expect(inputs[1].element.disabled).toBe(true)
    expect(wrapper.find('.zt-radio').classes()).toContain('zt-radio--success')
    await inputs[2].setValue()
    expect(wrapper.emitted('update:modelValue')).toEqual([['c']])
  })
  it('inherits provider size for both group and standalone radios', () => {
    const wrapper = mount(ZtConfigProvider, { props: { size: 'large' }, slots: { default: () => [h(ZtRadio, { label: 'a' }), h(ZtRadioGroup, { segmented: true }, { default: () => h(ZtRadio, { label: 'b' }) })] } })
    expect(wrapper.findAll('.zt-radio').every(radio => radio.classes().includes('zt-radio--large'))).toBe(true)
    expect(wrapper.find('.zt-radio-group').classes()).toContain('zt-radio-group--large')
  })
})

describe('opt-in clear controls', () => {
  it.each([
    [ZtInput, { modelValue: 'hello' }, '.zt-input__clear'],
    [ZtPassword, { modelValue: 'secret' }, '.zt-input__clear'],
    [ZtSelect, { modelValue: 'a', options: [{ label: '选项', value: 'a' }] }, '.zt-select__clear'],
    [ZtTreeSelect, { modelValue: 'a', data: [{ key: 'a', label: '选项' }] }, '.zt-hierarchy__clear'],
    [ZtCascader, { modelValue: ['a'], options: [{ key: 'a', label: '选项' }] }, '.zt-hierarchy__clear'],
    [ZtTimePicker, { modelValue: '12:00:00' }, '.zt-time-picker__clear'],
  ] as const)('%s only exposes a clear action when opted in and enabled', async (component, props, selector) => {
    const wrapper = mount(component as typeof ZtInput, { props: props as any })
    expect(wrapper.find(selector).exists()).toBe(false)
    await wrapper.setProps({ clearable: true })
    expect(wrapper.find(selector).exists()).toBe(true)
    await wrapper.find(selector).trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find(selector).exists()).toBe(false)
    wrapper.unmount()
  })
  it('does not create a suffix solely for clearing, and removes the empty floating action', async () => {
    const input = mount(ZtInput, { props: { clearable: true, modelValue: 'hello' } })
    await input.setProps({ modelValue: '' })
    expect(input.find('.zt-input__clear-slot').exists()).toBe(false)
    expect(input.find('.zt-input__suffix').exists()).toBe(false)
    expect(input.find('.zt-input__clear').exists()).toBe(false)
    const select = mount(ZtSelect, { props: { clearable: true, modelValue: ['a'], options: [{ label: '很长的业务名称', value: 'a' }], multiple: true } })
    expect(select.find('.zt-select__tag-label').attributes('title')).toBe('很长的业务名称')
    await select.setProps({ modelValue: [] })
    expect(select.classes()).toContain('has-clear')
  })
})


describe('Select keyboard chip removal', () => {
  it('returns focus to the combobox after activating a focused remove button', async () => {
    const value = ref(['a', 'b'])
    const wrapper = mount({ render: () => h(ZtSelect, {
      multiple: true,
      modelValue: value.value,
      options: [{ label: '甲', value: 'a' }, { label: '乙', value: 'b' }],
      'onUpdate:modelValue': next => { value.value = next as string[] },
    }) }, { attachTo: document.body })
    try {
      const remove = wrapper.get<HTMLButtonElement>('.zt-select__tag-remove')
      remove.element.focus()
      expect(document.activeElement).toBe(remove.element)
      // Native Enter/Space activation dispatches click on the focused button.
      await remove.trigger('click')
      await nextTick()
      expect(value.value).toEqual(['b'])
      expect(document.activeElement).toBe(wrapper.get('[role="combobox"]').element)
    } finally { wrapper.unmount() }
  })
})
