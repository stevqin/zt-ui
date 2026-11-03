import { mount } from '@vue/test-utils'
import { Fragment, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import * as avatars from '../src/components/avatar'
import ZtConfigProvider from '../src/components/config-provider/ZtConfigProvider.vue'

const { ZtAvatar } = avatars
// Resolving the new public export makes its absence an explicit behavioral failure.
const Group = () => (avatars as Record<string, any>).ZtAvatarGroup

describe('Avatar group', () => {
  it('exports a group component', () => { expect(Group()).toBeDefined() })
  it('preserves native attributes, classes, styles and a single click listener on the group element', async () => {
    let clicks = 0
    const wrapper = mount(Group(), {
      attrs: { id: 'team', 'data-team': 'x', 'aria-describedby': 'help', class: 'custom', style: { opacity: '0.8' }, onClick: () => { clicks++ } },
      slots: { default: () => h(ZtAvatar, { alt: '林青' }) },
    })
    const group = wrapper.get('.zt-avatar-group')
    expect(group.attributes('id')).toBe('team')
    expect(group.attributes('data-team')).toBe('x')
    expect(group.attributes('aria-describedby')).toBe('help')
    expect(group.classes().filter(name => name === 'custom')).toHaveLength(1)
    expect(group.attributes('style')).toContain('opacity: 0.8')
    await group.trigger('click')
    expect(clicks).toBe(1)
  })
  it('inherits size and shape while preserving explicit member overrides', () => {
    const wrapper = mount(Group(), { props: { size: 48, shape: 'square' }, slots: { default: () => [h(ZtAvatar, { alt: '林青' }), h(ZtAvatar, { alt: '苏宁', size: 'mini', shape: 'circle' })] } })
    const members = wrapper.findAll('.zt-avatar')
    expect(members[0].attributes('style')).toContain('48px')
    expect(members[0].classes()).toContain('zt-avatar--square')
    expect(members[1].classes()).toContain('zt-avatar--mini')
    expect(members[1].classes()).toContain('zt-avatar--circle')
  })
  it('flattens loop fragments and exposes overflow members through an accessible button', async () => {
    const wrapper = mount(Group(), { attachTo: document.body, props: { max: 2, size: 'large', label: '设计团队' }, slots: { default: () => h(Fragment, null, ['林青', '苏宁', '陈晨', '李言'].map(alt => h(ZtAvatar, { alt }))) } })
    expect(wrapper.attributes('aria-label')).toBe('设计团队')
    expect(wrapper.findAll('.zt-avatar')).toHaveLength(2)
    const button = wrapper.get('button')
    expect(button.text()).toBe('+2')
    expect(button.attributes('aria-label')).toBe('查看全部 4 位成员')
    await button.trigger('click'); await nextTick()
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(document.querySelectorAll('.zt-avatar-group__members button')).toHaveLength(4)
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('林青')
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('苏宁')
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('陈晨')
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('李言')
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('设计团队，全部成员')
    const list = document.querySelector<HTMLElement>('.zt-avatar-group__members')!
    expect(list.getAttribute('tabindex')).toBe('0')
    expect(list.getAttribute('aria-label')).toBe('设计团队，全部成员')
    expect(document.activeElement).toBe(list)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await nextTick()
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click'); await nextTick(); wrapper.unmount(); await nextTick()
    expect(document.querySelector('.zt-avatar-group__members')).toBeNull()
  })
  it('updates members and max without retaining an obsolete popup', async () => {
    const count = ref(4)
    const wrapper = mount(Group(), { attachTo: document.body, props: { max: 1 }, slots: { default: () => Array.from({ length: count.value }, (_, i) => h(ZtAvatar, { alt: `成员${i}`, key: i })) } })
    await wrapper.get('button').trigger('click'); count.value = 1; await nextTick()
    expect(wrapper.find('button').exists()).toBe(false)
    expect(document.querySelector('.zt-avatar-group__members')).toBeNull()
    count.value = 4; await nextTick()
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    expect(document.querySelector('.zt-avatar-group__members')).toBeNull()
    wrapper.unmount()
  })
  it('inherits config-provider size and supports an explicit CSS size', () => {
    const wrapper = mount(ZtConfigProvider, { props: { size: 'small' }, slots: { default: () => h(Group(), null, () => h(ZtAvatar)) } })
    expect(wrapper.get('.zt-avatar').classes()).toContain('zt-avatar--small')
    const custom = mount(Group(), { props: { size: '3rem' }, slots: { default: () => h(ZtAvatar) } })
    expect(custom.get('.zt-avatar').attributes('style')).toContain('3rem')
  })
})

it('emits member props, the original index and native event once when an overflow member is clicked', async () => {
  const wrapper = mount(Group(), { attachTo: document.body, props: { max: 2 }, slots: { default: () => ['甲', '乙', '丙', '丁'].map(alt => h(ZtAvatar, { alt })) } })
  await wrapper.get('button').trigger('click'); await nextTick()
  const buttons = document.querySelectorAll<HTMLButtonElement>('.zt-avatar-group__members button')
  expect(buttons).toHaveLength(4)
  buttons[3].querySelector('.zt-avatar')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  const events = wrapper.emitted('member-click')!
  expect(events).toHaveLength(1)
  expect(events[0][0]).toMatchObject({ alt: '丁' })
  expect(events[0][1]).toBe(3)
  expect(events[0][2]).toBeInstanceOf(MouseEvent)
  buttons[0].click()
  expect(wrapper.emitted('member-click')![1][0]).toMatchObject({ alt: '甲' })
  expect(wrapper.emitted('member-click')![1][1]).toBe(0)
  wrapper.unmount()
})

describe('Avatar image and fallback', () => {
  it('renders srcset-only sources and retries when the source set changes', async () => {
    const wrapper = mount(ZtAvatar, { props: { srcSet: '/one.svg 1x', alt: '林青' } })
    expect(wrapper.get('img').attributes('srcset')).toBe('/one.svg 1x')
    await wrapper.get('img').trigger('error'); expect(wrapper.text()).toBe('林')
    await wrapper.setProps({ srcSet: '/two.svg 2x' }); expect(wrapper.find('img').exists()).toBe(true)
  })
  it('keeps a complete emoji grapheme as its fallback initial', () => {
    expect(mount(ZtAvatar, { props: { alt: '👩🏽‍💻 林青' } }).text()).toBe('👩🏽‍💻')
  })
})


it('returns the exact supplied business item after reordering without leaking it to the DOM', async () => {
  const first = { id: 'u-1', name: '甲', department: '设计' }
  const second = { id: 'u-2', name: '乙', department: '商品' }
  const team = ref([first, second])
  const wrapper = mount(Group(), { attachTo: document.body, props: { max: 1 }, slots: { default: () => team.value.map(item => h(ZtAvatar, { key: item.id, alt: item.name, item })) } })
  expect(wrapper.get('.zt-avatar').attributes('item')).toBeUndefined()
  await wrapper.get('button').trigger('click'); await nextTick()
  document.querySelector<HTMLButtonElement>('.zt-avatar-group__member')!.click()
  expect(wrapper.emitted('member-click')![0][0]).toBe(team.value[0])
  team.value.reverse(); await nextTick()
  document.querySelector<HTMLButtonElement>('.zt-avatar-group__member')!.click()
  expect(wrapper.emitted('member-click')![1][0]).toBe(team.value[0])
  expect(wrapper.emitted('member-click')![1][0]).toMatchObject({ id: 'u-2', department: '商品' })
  expect(wrapper.emitted('member-click')![1][1]).toBe(0)
  wrapper.unmount()
})
