import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ApiReference from './ApiReference.vue'

describe('ApiReference', () => {
  it('renders a precise component API in the component reading flow', () => {
    const wrapper = mount(ApiReference, { props: { componentId: 'select' } })
    expect(wrapper.get('#api').text()).toContain('API')
    expect(wrapper.get('[data-api-section="props"]').text()).toContain('Attributes')
    expect(wrapper.get('[data-api-section="events"]').text()).toContain('Events')
    expect(wrapper.get('[data-api-section="slots"]').text()).toContain('Slots')
    expect(wrapper.get('[data-api-section="exposes"]').text()).toContain('Exposes')
    expect(wrapper.findAll('[data-api-row]').length).toBeGreaterThan(0)
    expect(wrapper.get('[data-api-row="modelValue"]').text()).toContain('model-value')
    expect(wrapper.findAll('th').map(cell => cell.text())).toEqual(
      expect.arrayContaining(['名称', '说明', '类型', '默认值']),
    )
    expect(wrapper.get('[data-api-row="modelValue"] td[data-label="说明"]').text()).not.toBe('')
  })

  it('omits empty sections and keeps types available', () => {
    const wrapper = mount(ApiReference, { props: { componentId: 'config-provider' } })
    expect(wrapper.find('[data-api-section="events"]').exists()).toBe(false)
    expect(wrapper.get('[data-api-section="types"]').text()).toContain('ZtConfigProviderProps')
  })
})
