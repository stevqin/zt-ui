import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { ZtDescriptions, ZtDescriptionsItem } from '../src'

describe('Descriptions grid constraints', () => {
  it('clamps spans to valid columns and updates when column changes', async () => {
    const wrapper = mount(ZtDescriptions, {
      props: { column: 2 },
      slots: { default: () => [h(ZtDescriptionsItem, { span: 9 }), h(ZtDescriptionsItem, { span: -1 })] },
    })
    const items = () => wrapper.findAll('.zt-descriptions__item')
    expect(items()[0].attributes('style')).toContain('span 2')
    expect(items()[1].attributes('style')).toContain('span 1')
    await wrapper.setProps({ column: 3 })
    expect(items()[0].attributes('style')).toContain('span 3')
    await wrapper.setProps({ column: 0 })
    expect(wrapper.get('dl').attributes('style')).toContain('--zt-descriptions-columns: 1')
    expect(items()[0].attributes('style')).toContain('span 1')
  })

  it('preserves header/label slots, width overrides and reactive direction', async () => {
    const wrapper = mount(ZtDescriptions, {
      props: { labelWidth: 112, direction: 'vertical' },
      slots: {
        title: () => h('strong', '采购信息'), extra: () => h('a', { href: '#order' }, '查看订单'),
        default: () => [
          h(ZtDescriptionsItem, { className: 'custom-item' }, { label: () => h('span', '订单号'), default: () => 'PO-001' }),
          h(ZtDescriptionsItem, { label: '备注', labelWidth: '8em' }, () => '按计划交付'),
        ],
      },
    })
    expect(wrapper.get('.zt-descriptions__title').text()).toBe('采购信息')
    expect(wrapper.get('.zt-descriptions__extra a').attributes('href')).toBe('#order')
    expect(wrapper.get('.custom-item').classes()).toContain('is-vertical')
    expect(wrapper.findAll('dt')[0].attributes('style')).toContain('112px')
    expect(wrapper.findAll('dt')[1].attributes('style')).toContain('8em')
    await wrapper.setProps({ direction: 'horizontal', labelWidth: 96 })
    expect(wrapper.get('.custom-item').classes()).toContain('is-horizontal')
    expect(wrapper.findAll('dt')[0].attributes('style')).toContain('96px')
  })
})
