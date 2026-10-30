import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { compile } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ZtButton, ZtDropdown } from '../src'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = compile('src/components/dropdown/dropdown.scss').css
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  vi.useRealTimers()
})

// The indicator must follow the actual menu state, including automatic closes,
// rather than toggling only when the trigger is clicked.
describe('Dropdown trigger indicator', () => {
  it('forwards scoped slot values from custom trigger components', () => {
    const Trigger = defineComponent({ setup: (_, { slots }) => () => h('button', slots.default?.({ label: '更多' })) })
    const wrapper = mount(ZtDropdown, {
      slots: { default: () => h(Trigger, { role: 'button' }, { default: ({ label }: { label?: string } = {}) => label }) },
    })
    wrappers.push(wrapper)
    expect(wrapper.get('button').text()).toBe('更多')
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
  })
  it.each(['text', 'array'])('preserves render-function Button %s children beside the arrow', kind => {
    const wrapper = mount(ZtDropdown, {
      slots: { default: () => h(ZtButton, {}, kind === 'text' ? '更多' : [h('span', '更多')]) },
    })
    wrappers.push(wrapper)
    expect(wrapper.get('button').text()).toBe('更多')
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
  })
  it('retains the indicator when a compiled native trigger updates its text', async () => {
    const label = ref('更多')
    const wrapper = mount(defineComponent({
      components: { ZtDropdown },
      setup: () => ({ label }),
      template: '<ZtDropdown><button>{{ label }}</button></ZtDropdown>',
    }))
    wrappers.push(wrapper)
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
    label.value = '操作菜单'
    await nextTick()
    expect(wrapper.get('button').text()).toBe('操作菜单')
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
  })
  it.each(['native', 'component'])('preserves one rotating arrow inside a custom %s button', async kind => {
    const wrapper = mount(ZtDropdown, {
      attachTo: document.body,
      props: { items: [{ key: 'edit', label: '编辑' }] },
      slots: { default: () => kind === 'native' ? h('button', '更多') : h(ZtButton, { status: 'primary' }, () => '更多') },
    })
    wrappers.push(wrapper)
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.get('button').text()).toBe('更多')
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
    const arrow = () => getComputedStyle(wrapper.get('.zt-dropdown__arrow').element)
    expect(arrow().transform).toBe('rotate(0deg)')
    await wrapper.get('button').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(arrow().transform).toBe('rotate(180deg)')
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click()
    await nextTick()
    expect(arrow().transform).toBe('rotate(0deg)')
  })
  it('provides one decorative SVG arrow with default or custom trigger text', async () => {
    const wrapper = mount(ZtDropdown, { props: { items: [] } })
    wrappers.push(wrapper)
    expect(wrapper.get('button').text()).toBe('操作')
    expect(wrapper.findAll('.zt-dropdown__arrow svg')).toHaveLength(1)
    expect(wrapper.get('.zt-dropdown__arrow').attributes('aria-hidden')).toBe('true')
    const custom = mount(ZtDropdown, { props: { items: [] }, slots: { default: '订单操作' } })
    wrappers.push(custom)
    expect(custom.get('button').text()).toBe('订单操作')
    expect(custom.findAll('.zt-dropdown__arrow svg')).toHaveLength(1)
  })

  it('rotates on keyboard opening and resets after selecting a command', async () => {
    const wrapper = mount(ZtDropdown, {
      attachTo: document.body,
      props: { items: [{ key: 'edit', label: '编辑' }] },
    })
    wrappers.push(wrapper)
    const arrow = () => getComputedStyle(wrapper.get('.zt-dropdown__arrow').element)
    expect(arrow().transform).toBe('rotate(0deg)')
    expect(arrow().transition).toContain('transform')
    await wrapper.get('button').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(arrow().transform).toBe('rotate(180deg)')
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click()
    await nextTick()
    expect(wrapper.emitted('command')?.[0]?.[0]).toBe('edit')
    expect(arrow().transform).toBe('rotate(0deg)')
  })

  it('rotates for hover and resets when disabled while open', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ZtDropdown, { attachTo: document.body, props: { trigger: 'hover', items: [] } })
    wrappers.push(wrapper)
    await wrapper.get('.zt-popover__reference').trigger('pointerenter')
    await vi.advanceTimersByTimeAsync(1)
    expect(getComputedStyle(wrapper.get('.zt-dropdown__arrow').element).transform).toBe('rotate(180deg)')
    await wrapper.setProps({ disabled: true })
    expect(getComputedStyle(wrapper.get('.zt-dropdown__arrow').element).transform).toBe('rotate(0deg)')
    expect(document.querySelector('.zt-popover')).toBeNull()
  })
})
