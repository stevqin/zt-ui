import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import * as library from '../src'
import { ZtIcon, ztIconNames } from '../src'

describe('expanded icon collection', () => {
  it('offers 309 distinct exported glyphs and preserves the previous 189 names', () => {
    const originalNames = ['add', 'minus', 'close', 'check', 'search', 'info', 'warning', 'error', 'success', 'chevron-up', 'chevron-right', 'chevron-down', 'chevron-left', 'arrow-up', 'arrow-right', 'arrow-down', 'arrow-left', 'more', 'more-vertical', 'menu', 'user', 'users', 'image', 'file', 'folder', 'paperclip', 'upload', 'download', 'calendar', 'clock', 'edit', 'delete', 'home', 'settings', 'refresh', 'visibility', 'eye-off', 'lock', 'unlock', 'save', 'copy', 'link', 'external-link', 'share', 'clipboard', 'checklist', 'filter-list', 'filter', 'tag', 'star', 'heart', 'bookmark', 'mail', 'phone', 'location', 'help', 'ban', 'play', 'pause', 'undo', 'redo', 'login', 'logout', 'maximize', 'maximize-2', 'minimize-2', 'chart', 'sun', 'moon', 'chart-bar', 'chart-pie', 'chart-area', 'chart-scatter', 'chart-radar', 'chart-donut', 'chart-candlestick', 'chart-funnel', 'chart-gauge', 'chart-heatmap', 'chart-boxplot', 'dashboard', 'database', 'server', 'table', 'rows', 'columns', 'sort-ascending', 'sort-descending', 'group', 'aggregate', 'formula', 'data-import', 'data-export', 'shirt', 'dress', 'jacket', 'pants', 'skirt', 'coat', 'hanger', 'shoe', 'bag', 'scissors', 'ruler', 'palette', 'store', 'shopping-cart', 'shopping-basket', 'barcode', 'qr-code', 'receipt', 'coupon', 'gift', 'credit-card', 'wallet', 'cash-register', 'percent', 'package', 'boxes', 'warehouse', 'inventory', 'pallet', 'forklift', 'truck', 'container', 'route', 'compass', 'scale', 'conveyor', 'briefcase', 'building', 'workflow', 'approval', 'stamp', 'contract', 'presentation', 'notebook', 'archive', 'printer', 'calendar-check', 'calendar-range', 'message', 'messages', 'send', 'bell', 'bell-off', 'megaphone', 'user-add', 'user-check', 'user-card', 'organization', 'handshake', 'headset', 'shield', 'shield-check', 'key', 'fingerprint', 'qr-scan', 'cloud', 'cloud-upload', 'wifi', 'globe', 'power', 'code', 'bug', 'monitor', 'laptop', 'smartphone', 'keyboard', 'mouse', 'camera', 'video', 'microphone', 'volume', 'volume-off', 'music', 'film', 'lightning', 'sparkles', 'target', 'flag', 'pin', 'rocket', 'timer', 'history', 'zoom-in', 'zoom-out', 'sliders', 'tool'] as const
    expect(ztIconNames).toEqual(expect.arrayContaining(originalNames))
    expect(ztIconNames.length).toBeGreaterThanOrEqual(309)
    expect(new Set(ztIconNames).size).toBe(ztIconNames.length)
    const signatures = ztIconNames.map(name => {
      const wrapper = mount(ZtIcon, { props: { name } })
      const signature = wrapper.get('svg').element.innerHTML
      const exportName = `Zt${name.split('-').map(part => part[0]!.toUpperCase() + part.slice(1)).join('')}Icon`
      expect(library).toHaveProperty(exportName)
      wrapper.unmount()
      return signature
    })
    expect(new Set(signatures).size).toBe(ztIconNames.length)
  })
})

describe('icon motion', () => {
  it('stays static by default and preserves rotate alongside motion', () => {
    const wrapper = mount(ZtIcon, { props: { name: 'heart', rotate: 30 } })
    expect(wrapper.classes()).not.toContain('zt-icon-glyph--animation-pulse')
    expect(wrapper.attributes('style')).toContain('--zt-icon-rotate: 30deg')
  })

  it('configures continuous and hover animations without extra accessibility roles', async () => {
    const wrapper = mount(ZtIcon, { props: { name: 'heart', animation: 'pulse' } })
    expect(wrapper.classes()).toContain('zt-icon-glyph--animation-pulse')
    expect(wrapper.classes()).toContain('zt-icon-glyph--trigger-always')
    expect(wrapper.attributes('role')).toBeUndefined()
    await wrapper.setProps({ animationTrigger: 'hover' })
    expect(wrapper.classes()).toContain('zt-icon-glyph--trigger-hover')
  })

  it('plays, finishes and replays a click animation while forwarding click', async () => {
    const wrapper = mount(ZtIcon, { props: { name: 'heart', animation: 'pulse', animationTrigger: 'click' } })
    expect(wrapper.classes()).not.toContain('is-animating')
    await wrapper.trigger('click')
    await nextTick()
    expect(wrapper.classes()).toContain('is-animating')
    await wrapper.get('svg').trigger('animationend')
    expect(wrapper.classes()).not.toContain('is-animating')
    await wrapper.trigger('click')
    await nextTick()
    expect(wrapper.classes()).toContain('is-animating')
  })

  it('responds to ancestor button activation and removes listeners on unmount', async () => {
    const wrapper = mount({ render: () => h('button', [h(ZtIcon, { name: 'heart', animation: 'pulse', animationTrigger: 'click' })]) })
    await wrapper.trigger('click')
    await nextTick()
    expect(wrapper.get('.zt-icon-glyph').classes()).toContain('is-animating')
    const removeListener = vi.spyOn(wrapper.element, 'removeEventListener')
    wrapper.unmount()
    expect(removeListener).toHaveBeenCalledWith('click', expect.any(Function))
    removeListener.mockRestore()
  })

  it('clears one-shot state when switching triggers and prioritizes legacy spin', async () => {
    const wrapper = mount(ZtIcon, { props: { name: 'heart', animation: 'pulse', animationTrigger: 'click' } })
    await wrapper.trigger('click')
    await wrapper.setProps({ animationTrigger: 'hover' })
    expect(wrapper.classes()).not.toContain('is-animating')
    await wrapper.setProps({ spin: true })
    expect(wrapper.classes()).toContain('is-spin')
    expect(wrapper.classes()).not.toContain('zt-icon-glyph--animation-pulse')
  })
})


it('uses clean flat barcode ends without changing ordinary line-icon caps', () => {
  const barcode = mount(ZtIcon, { props: { name: 'barcode', strokeWidth: 1.5 } })
  expect(barcode.get('svg').attributes('stroke-linecap')).toBe('butt')
  expect(barcode.get('svg').attributes('stroke-width')).toBe('1.5')
  const search = mount(ZtIcon, { props: { name: 'search' } })
  expect(search.get('svg').attributes('stroke-linecap')).toBe('round')
  barcode.unmount()
  search.unmount()
})
