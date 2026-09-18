import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtBreadcrumb, ZtBreadcrumbItem, ZtRadio, ZtRadioGroup, ZtSegmented } from '../src'

describe('Breadcrumb', () => {
  it('renders semantic navigation, custom separators and the current page', async () => {
    const wrapper = mount(ZtBreadcrumb, { props: { separator: '/' }, slots: { default: () => [
      h(ZtBreadcrumbItem, { to: '/' }, () => '首页'),
      h(ZtBreadcrumbItem, {}, () => '详情'),
    ] } })
    await nextTick()
    expect(wrapper.attributes('aria-label')).toBe('面包屑')
    expect(wrapper.findAll('.zt-breadcrumb__separator')).toHaveLength(1)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('详情')
  })
})

describe('Segmented', () => {
  it('supports object options, keyboard selection and disabled values', async () => {
    const value = ref('day')
    const wrapper = mount(ZtSegmented, { props: {
      modelValue: value.value,
      options: [{ label: '日', value: 'day' }, { label: '周', value: 'week', disabled: true }, { label: '月', value: 'month' }],
      'onUpdate:modelValue': next => { value.value = next; wrapper.setProps({ modelValue: next }) },
    } })
    const radios = wrapper.findAll('[role="radio"]')
    await radios[0].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['month'])
    expect(radios[2].attributes('aria-checked')).toBe('true')
  })
})

describe('ZtRadioGroup segmented appearance', () => {
  it('uses the segmented boolean as the sole segmented-style switch', () => {
    const wrapper = mount(ZtRadioGroup, {
      props: { segmented: true, modelValue: 'a' },
      slots: { default: () => h(ZtRadio, { label: 'a' }, () => 'A') },
    })

    expect(wrapper.classes()).toContain('zt-radio-group--segmented')
  })

  it('does not let the removed variant prop change appearance', () => {
    const wrapper = mount(ZtRadioGroup, {
      props: { segmented: false, variant: 'segmented' } as any,
    })

    expect(wrapper.classes()).toContain('zt-radio-group--default')
  })
})
