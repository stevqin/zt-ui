import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ZtConfigProvider, ZtLink, ZtText } from '../src'

describe('Link', () => {
  it('makes disabled links non-navigable and secures blank targets', async () => {
    const disabled = mount(ZtLink, { props: { href: '/delete', disabled: true }, slots: { default: '删除' } })
    expect(disabled.attributes('href')).toBeUndefined()
    expect(disabled.attributes('aria-disabled')).toBe('true')
    expect(disabled.attributes('tabindex')).toBe('-1')
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
    const blank = mount(ZtLink, { props: { href: 'https://example.com', target: '_blank' } })
    expect(blank.attributes('rel')).toBe('noopener noreferrer')
  })

  it('uses an installed router for route targets and honors replace', async () => {
    const replace = vi.fn().mockResolvedValue(undefined)
    const resolve = vi.fn().mockReturnValue({ href: '/reports/7' })
    const wrapper = mount(ZtLink, {
      props: { to: { name: 'report', params: { id: 7 } }, replace: true },
      slots: { default: '报表' },
      global: { config: { globalProperties: { $router: { replace, resolve } } } },
    })
    expect(wrapper.attributes('href')).toBe('/reports/7')
    await wrapper.trigger('click')
    expect(replace).toHaveBeenCalledWith({ name: 'report', params: { id: 7 } })
  })

  it('inherits size and renders named icons on both sides', () => {
    const wrapper = mount(ZtConfigProvider, { props: { size: 'small' }, slots: { default: () => h(ZtLink, { href: '#', icon: 'home', suffixIcon: 'arrow-right', status: 'primary' }, () => '首页') } })
    const link = wrapper.get('a')
    expect(link.classes()).toContain('zt-link--small')
    expect(link.classes()).toContain('zt-link--primary')
    expect(link.findAll('.zt-icon-glyph')).toHaveLength(2)
  })
})

describe('Text', () => {
  it('applies line clamp and derives a title from plain text', () => {
    const wrapper = mount(ZtText, { props: { lineClamp: 2 }, slots: { default: '一段较长文字' } })
    expect(wrapper.attributes('title')).toBe('一段较长文字')
    expect(wrapper.attributes('style')).toContain('--zt-line-clamp: 2')
    expect(wrapper.classes()).toContain('is-line-clamp')
  })

  it('uses line clamp before truncation and does not infer complex slot titles', () => {
    const wrapper = mount(ZtText, { props: { truncated: true, lineClamp: 3 }, slots: { default: () => h('b', '复杂内容') } })
    expect(wrapper.classes()).toContain('is-line-clamp')
    expect(wrapper.classes()).not.toContain('is-truncated')
    expect(wrapper.attributes('title')).toBeUndefined()
  })

  it('inherits size, validates tags and reacts to an explicit title', async () => {
    const title=ref('完整说明')
    const wrapper=mount(ZtConfigProvider,{props:{size:'large'},slots:{default:()=>h(ZtText,{tag:'code',status:'danger',title:title.value},()=> 'const value = 1')}})
    const text=wrapper.get('code')
    expect(text.classes()).toContain('zt-text--large')
    expect(text.classes()).toContain('zt-text--danger')
    expect(text.attributes('title')).toBe('完整说明')
    title.value='更新说明';await nextTick();expect(text.attributes('title')).toBe('更新说明')
  })
})
