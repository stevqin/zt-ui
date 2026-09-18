import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtBadge, ZtCollapse, ZtCollapseItem, ZtDescriptions, ZtDescriptionsItem, ZtResult } from '../src'

describe('Descriptions', () => {
  it('renders semantic terms, values and responsive span metadata', async () => {
    const wrapper = mount(ZtDescriptions, { props: { title: '订单', column: 2, border: true }, slots: { default: () => [
      h(ZtDescriptionsItem, { label: '编号' }, () => 'A-01'),
      h(ZtDescriptionsItem, { label: '备注', span: 2 }, () => '已付款'),
    ] } })
    await nextTick()
    expect(wrapper.get('dl').attributes('aria-label')).toBe('订单')
    expect(wrapper.findAll('dt')).toHaveLength(2)
    expect(wrapper.findAll('.zt-descriptions__item')[1].attributes('style')).toContain('span 2')
  })
})

describe('Collapse', () => {
  it('supports accordion, disabled panels and keyboard semantics', async () => {
    const value = ref<string | number | Array<string | number>>('a')
    const wrapper = mount(ZtCollapse, { props: { modelValue: value.value, accordion: true, 'onUpdate:modelValue': next => { value.value=next; wrapper.setProps({modelValue:next}) } }, slots: { default: () => [
      h(ZtCollapseItem, { name: 'a', title: '甲' }, () => '甲内容'),
      h(ZtCollapseItem, { name: 'b', title: '乙' }, () => '乙内容'),
      h(ZtCollapseItem, { name: 'c', title: '丙', disabled: true }, () => '丙内容'),
    ] } })
    await nextTick(); const buttons=wrapper.findAll('button.zt-collapse-item__header')
    await buttons[1].trigger('click'); expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(buttons[1].attributes('aria-expanded')).toBe('true'); expect(buttons[2].attributes('disabled')).toBeDefined()
  })
})

describe('Result', () => {
  it('renders status content and extension slot', () => {
    const wrapper = mount(ZtResult, { props: { status: 'success', title: '提交成功', subTitle: '数据已保存' }, slots: { extra: () => h('button','返回') } })
    expect(wrapper.classes()).toContain('zt-result--success')
    expect(wrapper.get('[role="status"]').text()).toContain('提交成功')
    expect(wrapper.get('button').text()).toBe('返回')
  })
})

describe('Badge status', () => {
  it('uses status as the sole semantic color prop', () => {
    const wrapper = mount(ZtBadge, { props: { value: 8, status: 'danger', type: 'success' } as any })

    expect(wrapper.get('.zt-badge__content').classes()).toContain('zt-badge--danger')
  })
})
