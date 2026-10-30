import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtButton, ZtDropdown } from '../src'

const wrappers: VueWrapper[] = []
afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()); document.body.innerHTML = ''; vi.useRealTimers() })
const items = [{ key: 'edit', label: '编辑' }, { key: 'remove', label: '删除' }]
function mountTrigger(trigger: () => ReturnType<typeof h>, props = {}) {
  const wrapper = mount(ZtDropdown, { attachTo: document.body, props: { items, ...props }, slots: { default: trigger } })
  wrappers.push(wrapper)
  return wrapper
}

describe('Dropdown custom trigger', () => {
  it.each([['span', 'Enter'], ['span', ' '], ['a', 'Enter'], ['a', ' ']])('supports %s semantic button activation with %s', async (tag, key) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    const wrapper = mountTrigger(() => h(tag, { role: 'button' }, '更多'))
    const trigger = wrapper.get('[aria-haspopup="menu"]')
    expect(trigger.attributes('tabindex')).toBe('0')
    // Separate the synthetic click from Vue's listener installation timestamp.
    vi.setSystemTime(Date.now() + 10)
    await trigger.trigger('keydown', { key })
    expect(document.querySelector('[role="menu"]')).not.toBeNull()
  })
  it.each([true, false])('preserves host keyboard handlers with custom trigger: %s', async custom => {
    const keydown = vi.fn()
    const wrapper = mountTrigger(() => h(custom ? 'button' : 'strong', '更多'), { onKeydown: keydown })
    await wrapper.get('button').trigger('keydown', { key: 'ArrowDown' })
    expect(keydown).toHaveBeenCalledTimes(1)
    expect(document.querySelector('[role="menu"]')).not.toBeNull()
  })
  it('uses the ZtButton itself, preserving its styling, click and component ref', async () => {
    const click = vi.fn()
    const original = ref()
    const wrapper = mountTrigger(() => h(ZtButton, { ref: original, status: 'primary', size: 'small', style: { color: 'red' }, onClick: click }, () => '更多'))
    expect(wrapper.findAll('button')).toHaveLength(1)
    const button = wrapper.get('button')
    expect(button.classes()).toContain('zt-button--primary')
    expect(button.classes()).toContain('zt-button--small')
    expect(button.classes()).not.toContain('zt-dropdown__trigger')
    expect(button.attributes('style')).toContain('color: red')
    expect(wrapper.findAll('button > .zt-dropdown__arrow svg')).toHaveLength(1)
    expect(original.value.$el).toBe(button.element)
    expect(button.attributes('aria-haspopup')).toBe('menu')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
    expect(button.attributes('aria-expanded')).toBe('true')
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click()
    await nextTick()
    expect(document.activeElement).toBe(button.element)
    expect(wrapper.emitted('command')?.[0]?.[0]).toBe('edit')
  })

  it('keeps native refs and focuses first/last menu items, restoring focus on Escape', async () => {
    const original = ref<HTMLButtonElement>()
    const keydown = vi.fn()
    const wrapper = mountTrigger(() => h('button', { ref: original, onKeydown: keydown }, '更多'))
    expect(wrapper.findAll('button')).toHaveLength(1)
    const button = wrapper.get('button')
    expect(original.value).toBe(button.element)
    await button.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(document.activeElement?.textContent).toBe('删除')
    expect(keydown).toHaveBeenCalledTimes(1)
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(button.element)
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement?.textContent).toBe('编辑')
  })

  it.each(['parent', 'child'] as const)('blocks clicks and keyboard/hover opening when %s disabled', async source => {
    vi.useFakeTimers()
    const click = vi.fn()
    const wrapper = mountTrigger(() => h('button', { disabled: source === 'child', onClick: click }, '更多'), { disabled: source === 'parent', trigger: 'hover' })
    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await button.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('.zt-popover__reference').trigger('pointerenter')
    await vi.advanceTimersByTimeAsync(1)
    expect(click).not.toHaveBeenCalled()
    expect(document.querySelector('[role="menu"]')).toBeNull()
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('does not restore trigger focus when Tab closes the menu', async () => {
    const wrapper = mountTrigger(() => h('button', '更多'))
    const button = wrapper.get('button')
    await button.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    await nextTick()
    expect(document.activeElement).not.toBe(button.element)
    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it('closes an open menu when the child becomes disabled', async () => {
    const disabled = ref(false)
    const wrapper = mountTrigger(() => h(ZtButton, { disabled: disabled.value }, () => '更多'))
    await wrapper.get('button').trigger('click')
    expect(document.querySelector('[role="menu"]')).not.toBeNull()
    disabled.value = true
    await nextTick()
    await nextTick()
    expect(document.querySelector('[role="menu"]')).toBeNull()
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
  })

  it('preserves the default styled trigger for non-interactive rich labels', () => {
    const wrapper = mountTrigger(() => h('strong', '订单操作'))
    expect(wrapper.get('button').classes()).toContain('zt-dropdown__trigger')
    expect(wrapper.get('button strong').text()).toBe('订单操作')
    expect(wrapper.findAll('.zt-dropdown__arrow')).toHaveLength(1)
  })
})
