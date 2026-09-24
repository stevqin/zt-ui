import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZtForm, ZtFormItem } from '../src/components/form'
import { ZtSelect } from '../src/components/select'
import { ZtSelectBox } from '../src/components/select-box'
import { ZtInputTag } from '../src/components/input-tag'

describe('Select/SelectBox hide remove icons when not editable', () => {
  it('Select hides tag remove when disabled', async () => {
    const Host = defineComponent({
      components: { ZtSelect },
      setup: () => ({
        values: ref(['a', 'b']),
        disabled: ref(false),
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      }),
      template: `<ZtSelect v-model="values" multiple :options="options" :disabled="disabled" />`,
    })
    const wrapper = mount(Host)
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(2)
    ;(wrapper.vm as any).disabled = true
    await nextTick()
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(0)
    expect(wrapper.findAll('.zt-select__tag')).toHaveLength(2)
  })

  it('Select hides tag remove when readonly', async () => {
    const Host = defineComponent({
      components: { ZtSelect },
      setup: () => ({
        values: ref(['a']),
        readonly: ref(false),
        options: [{ label: 'A', value: 'a' }],
      }),
      template: `<ZtSelect v-model="values" multiple :options="options" clearable :readonly="readonly" />`,
    })
    const wrapper = mount(Host)
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(1)
    ;(wrapper.vm as any).readonly = true
    await nextTick()
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(0)
    expect(wrapper.find('.zt-select__clear').exists()).toBe(false)
  })

  it('Select hides tag remove when Form is disabled', async () => {
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtSelect },
      setup: () => ({
        model: ref({ picks: ['a'] }),
        options: [{ label: 'A', value: 'a' }],
      }),
      template: `<ZtForm :model="model" disabled><ZtFormItem prop="picks"><ZtSelect v-model="model.picks" multiple :options="options" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    expect(wrapper.findAll('.zt-select__tag-remove')).toHaveLength(0)
    expect(wrapper.findAll('.zt-select__tag')).toHaveLength(1)
  })

  it('SelectBox hides clear icon when disabled or readonly', async () => {
    const Host = defineComponent({
      components: { ZtSelectBox },
      setup: () => ({
        values: ref(['a']),
        readonly: ref(false),
        disabled: ref(false),
        options: [{ label: 'A', value: 'a' }],
      }),
      template: `<ZtSelectBox v-model="values" :options="options" clearable :readonly="readonly" :disabled="disabled" />`,
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.zt-select-box__clear').exists()).toBe(true)
    ;(wrapper.vm as any).readonly = true
    await nextTick()
    expect(wrapper.find('.zt-select-box__clear').exists()).toBe(false)
    ;(wrapper.vm as any).readonly = false
    ;(wrapper.vm as any).disabled = true
    await nextTick()
    expect(wrapper.find('.zt-select-box__clear').exists()).toBe(false)
  })

  it('InputTag reference: hide remove when disabled', async () => {
    const Host = defineComponent({
      components: { ZtInputTag },
      setup: () => ({ tags: ref(['x']), disabled: ref(false) }),
      template: `<ZtInputTag v-model="tags" :disabled="disabled" />`,
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.zt-input-tag__tag button').exists()).toBe(true)
    ;(wrapper.vm as any).disabled = true
    await nextTick()
    expect(wrapper.find('.zt-input-tag__tag button').exists()).toBe(false)
  })
})
