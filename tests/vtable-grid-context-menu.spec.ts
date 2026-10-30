import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { overlayContextKey } from '../src/components/overlay/context'
import GridContextMenu from '../src/components/vtable-grid/GridContextMenu.vue'

afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks() })
const items = [{ type: 'hidden', visible: false }, { type: 'disabled', text: '禁用', disabled: true }, { type: 'edit', text: '编辑' }, { type: 'delete', text: '删除', divided: true }]

describe('grid context menu', () => {
  it('focuses eligible entries, navigates keyboard and emits chosen items', async () => {
    const wrapper = mount(GridContextMenu, { props: { items, x: 10, y: 20 }, attachTo: document.body })
    await nextTick()
    const buttons = wrapper.findAll('[role="menuitem"]')
    expect(buttons).toHaveLength(3)
    expect(document.activeElement).toBe(buttons[1].element)
    await buttons[1].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(buttons[2].element)
    await buttons[2].trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(buttons[1].element)
    await buttons[1].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(buttons[2].element)
    await buttons[0].trigger('click')
    expect(wrapper.emitted('choose')).toBeUndefined()
    await buttons[2].trigger('click')
    expect(wrapper.emitted('choose')?.[0]).toEqual([items[3]])
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })
  it('clamps measured bounds and restores previous focus on Escape/unmount', async () => {
    const previous = document.createElement('button'); document.body.append(previous); previous.focus()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 200, height: 150 } as DOMRect)
    const wrapper = mount(GridContextMenu, { props: { items, x: window.innerWidth, y: window.innerHeight }, attachTo: document.body })
    await nextTick()
    expect(wrapper.get('[role="menu"]').attributes('style')).toContain(`left: ${window.innerWidth - 208}px`)
    expect(wrapper.get('[role="menu"]').attributes('style')).toContain(`top: ${window.innerHeight - 158}px`)
    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
    expect(document.activeElement).toBe(previous)
  })
  it('registers with an enclosing overlay and renders above its layer', async () => {
    const unregister = vi.fn()
    const registerBranch = vi.fn(() => unregister)
    const wrapper = mount(GridContextMenu, { props: { items, x: 20, y: 20 }, attachTo: document.body, global: { provide: { [overlayContextKey as symbol]: { layer: ref(4200), interactive: ref(true), registerBranch } } } })
    await nextTick()
    expect(registerBranch).toHaveBeenCalledOnce()
    expect(wrapper.get('[role="menu"]').attributes('style')).toContain('z-index: 4201')
    wrapper.unmount()
    expect(unregister).toHaveBeenCalledOnce()
  })

  it('closes on Tab or outside click and preserves intentionally moved focus', async () => {
    const external = document.createElement('button'); document.body.append(external)
    const wrapper = mount(GridContextMenu, { props: { items, x: -10, y: -10 }, attachTo: document.body })
    await nextTick()
    await wrapper.get('[role="menu"]').trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('close')).toHaveLength(1)
    external.focus()
    wrapper.unmount()
    expect(document.activeElement).toBe(external)
    const second = mount(GridContextMenu, { props: { items, x: 0, y: 0 }, attachTo: document.body })
    await nextTick()
    external.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(second.emitted('close')).toHaveLength(1)
    second.unmount()
  })
})
