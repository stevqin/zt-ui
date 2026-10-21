import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { compile } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ZtDropdown } from '../src'

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
