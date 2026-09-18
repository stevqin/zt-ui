import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtConfigProvider, ZtIcon } from '../src'

describe('Icon', () => {
  it('renders a named icon with inherited size and accessible labeling', () => {
    const wrapper = mount(ZtConfigProvider, {
      props: { size: 'large' },
      slots: { default: () => h(ZtIcon, { name: 'search', label: '搜索' }) },
    })
    const icon = wrapper.get('[role="img"]')
    expect(icon.attributes('aria-label')).toBe('搜索')
    expect(icon.classes()).toContain('zt-icon-glyph--large')
    expect(icon.find('svg').exists()).toBe(true)
  })

  it('prefers slot content and hides decorative icons from assistive technology', () => {
    const wrapper = mount(ZtIcon, {
      props: { name: 'close', label: '' },
      slots: { default: '<b>自定义</b>' },
    })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('自定义')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('renders a custom component before a named icon and normalizes visual props', () => {
    const Custom = defineComponent({ render: () => h('i', { class: 'custom-icon' }, 'C') })
    const wrapper = mount(ZtIcon, { props: {
      name: 'search', component: Custom, size: 28, color: '#123456', rotate: 45,
      status: 'success', strokeWidth: 1.5,
    } })
    expect(wrapper.get('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.classes()).toContain('zt-icon-glyph--status-success')
    expect(wrapper.attributes('style')).toContain('--zt-icon-size: 28px')
    expect(wrapper.attributes('style')).toContain('--zt-icon-color: #123456')
    expect(wrapper.attributes('style')).toContain('--zt-icon-rotate: 45deg')
  })

  it('warns once for an unknown icon name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      mount(ZtIcon, { props: { name: 'missing' as never } })
      mount(ZtIcon, { props: { name: 'missing' as never } })
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0]?.[0]).toContain('missing')
    } finally { warn.mockRestore() }
  })

  it.each(['clipboard', 'checklist', 'filter-list'] as const)('exports the %s SelectBox icon', (name) => {
    const wrapper = mount(ZtIcon, { props: { name } })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('path').length).toBeGreaterThan(0)
  })
})
