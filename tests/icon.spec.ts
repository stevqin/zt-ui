import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtConfigProvider, ZtIcon, ztIconNames } from '../src'

describe('Icon', () => {
  it('renders a named icon with independent default size and accessible labeling', () => {
    const wrapper = mount(ZtConfigProvider, {
      props: { size: 'large' },
      slots: { default: () => h(ZtIcon, { name: 'search', label: '搜索' }) },
    })
    const icon = wrapper.get('[role="img"]')
    expect(icon.attributes('aria-label')).toBe('搜索')
    expect(icon.attributes('style')).toContain('--zt-icon-size: 1em')
    expect(icon.classes()).not.toContain('zt-icon-glyph--large')
    expect(icon.find('svg').exists()).toBe(true)
  })

  it.each([
    [undefined, '1em'],
    [24, '24px'],
    ['18px', '18px'],
    ['1.5em', '1.5em'],
    ['50%', '50%'],
  ] as const)('resolves independent icon size %s', (size, expected) => {
    const wrapper = mount({
      template: '<ZtConfigProvider size="large"><ZtIcon name="check" :size="size" /></ZtConfigProvider>',
      setup: () => ({ size }),
    }, { global: { components: { ZtConfigProvider, ZtIcon } } })
    expect(wrapper.get('.zt-icon-glyph').attributes('style')).toContain(`--zt-icon-size: ${expected}`)
  })

  it.each(['', '   ', 0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY] as const)(
    'falls back to 1em for invalid icon size %s',
    (size) => {
      const wrapper = mount(ZtIcon, { props: { name: 'check', size } })
      const icon = wrapper.get('.zt-icon-glyph')
      expect(icon.attributes('style')).toContain('--zt-icon-size: 1em')
      expect(icon.classes().some((name) => /^zt-icon-glyph--(?:mini|small|default|medium|large)$/.test(name))).toBe(false)
    },
  )

  it('does not emit preset size classes for string sizes', () => {
    const wrapper = mount(ZtIcon, { props: { name: 'check', size: 'large' } })
    expect(wrapper.get('.zt-icon-glyph').classes().some((name) => /^zt-icon-glyph--(?:mini|small|default|medium|large)$/.test(name))).toBe(false)
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

  it.each(ztIconNames)('renders the built-in %s glyph', (name) => {
    const wrapper = mount(ZtIcon, { props: { name, strokeWidth: 1.75 } })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    expect(svg.attributes('stroke-width')).toBe('1.75')
    expect(svg.element.childElementCount).toBeGreaterThan(0)
  })
})
