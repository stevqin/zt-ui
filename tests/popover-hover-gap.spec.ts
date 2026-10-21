import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZtDropdown, ZtPopover } from '../src'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
})
const popup = () => document.querySelector<HTMLElement>('.zt-popover')!
const bridge = () => document.querySelector<HTMLElement>('.zt-popover__hover-bridge')!

// Removing the gap hit area would close the menu while the pointer pauses
// between the trigger and panel, even though both belong to one interaction.
describe('hover popup gap', () => {
  it('keeps a Dropdown open while crossing or resting in the gap, and closes after leaving', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ZtDropdown, {
      attachTo: document.body,
      props: { trigger: 'hover', items: [{ key: 'edit', label: '编辑' }] },
    })
    wrappers.push(wrapper)
    await wrapper.get('.zt-popover__reference').trigger('pointerenter')
    await vi.advanceTimersByTimeAsync(1)
    expect(popup()).not.toBeNull()
    expect(bridge()).not.toBeNull()
    await wrapper.get('.zt-popover__reference').trigger('pointerleave')
    bridge().dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(500)
    expect(popup()).not.toBeNull()
    popup().dispatchEvent(new PointerEvent('pointerleave'))
    await vi.advanceTimersByTimeAsync(101)
    expect(popup()).toBeNull()
    expect(wrapper.emitted('visible-change')).toEqual([[true], [false]])
  })

  it.each([
    ['bottom-start', 'top', 'height', '-9px', '9px'],
    ['top-end', 'bottom', 'height', '-9px', '9px'],
    ['left-start', 'right', 'width', '-9px', '9px'],
    ['right-end', 'left', 'width', '-9px', '9px'],
  ] as const)('covers the gap on the trigger-facing side for %s', async (placement, side, dimension, inset, length) => {
    let triggerTop = 300;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('zt-popover__reference')
        ? { top: triggerTop, bottom: triggerTop + 40, left: 300, right: 400, width: 100, height: 40 } as DOMRect
        : { top: 0, bottom: 60, left: 0, right: 100, width: 100, height: 60 } as DOMRect
    })
    const wrapper = mount(ZtPopover, {
      attachTo: document.body,
      props: { visible: true, trigger: 'hover', placement, offset: 8 },
      slots: { default: '<button>触发</button>', content: '内容' },
    })
    wrappers.push(wrapper)
    await nextTick()
    await nextTick()
    expect(bridge()).not.toBeNull()
    expect(bridge().style[side]).toBe(inset)
    expect(bridge().style[dimension]).toBe(length)
    expect(bridge().style.position).toBe('absolute')
    await wrapper.setProps({ offset: 20 })
    expect(bridge().style[side]).toBe('-21px')
    expect(bridge().style[dimension]).toBe('21px')
    await wrapper.setProps({ placement: 'bottom-start' })
    expect(bridge().style.top).toBe('-21px')
    expect(bridge().style.bottom).toBe('')
    triggerTop = window.innerHeight - 50
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(popup().classList.contains('zt-popover--top-start')).toBe(true)
    expect(bridge().style.bottom).toBe('-21px')
    expect(bridge().style.top).toBe('')
    await wrapper.setProps({ offset: 0 })
    expect(bridge()).toBeNull()
    await wrapper.setProps({ offset: 8 })
    expect(bridge()).not.toBeNull()
    await wrapper.setProps({ trigger: 'click' })
    expect(bridge()).toBeNull()
  })
})
