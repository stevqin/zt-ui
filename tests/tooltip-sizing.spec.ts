import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { compile } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ZtPopover, ZtTooltip } from '../src'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = compile('src/components/popover/popover.scss').css
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
async function render(props = {}) {
  const wrapper = mount(ZtTooltip, { attachTo: document.body, props: { visible: true, content: '提示', ...props }, slots: { default: () => h('button', '触发') } })
  wrappers.push(wrapper)
  await nextTick()
  await nextTick()
  return wrapper
}
function popup() { return document.querySelector<HTMLElement>('.zt-popover')! }

describe('Tooltip dimensions', () => {
  it('uses compact content width for Tooltip and Popover by default', async () => {
    await render()
    const css = getComputedStyle(popup())
    expect(css.width).toBe('max-content')
    expect(css.minWidth).toBe('0')
    expect(css.maxWidth).toBe('calc(1024px - 16px)')
    wrappers[0]!.unmount(); wrappers.length = 0
    wrappers.push(mount(ZtPopover, { attachTo: document.body, props: { visible: true }, slots: { content: '短文' } }))
    await nextTick()
    const popoverCss = getComputedStyle(popup())
    expect(popoverCss.width).toBe('max-content')
    expect(popoverCss.minWidth).toBe('0')
    expect(popoverCss.maxWidth).toBe('calc(1024px - 16px)')
  })
  it('wraps long text and unbroken tokens inside the viewport-safe maximum', async () => {
    const text = '很长的提示内容 '.repeat(30) + 'unbroken'.repeat(40)
    await render({ content: text })
    const content = popup().querySelector<HTMLElement>('.zt-popover__content')!
    expect(content.textContent).toBe(text)
    expect(getComputedStyle(content).overflowWrap).toBe('anywhere')
    expect(getComputedStyle(content).whiteSpace).toBe('normal')
    expect(getComputedStyle(popup()).maxWidth).toBe('calc(1024px - 16px)')
  })
  it.each([
    [84, 96, '84px', '96px'],
    ['28rem', '7em', '28rem', '7em'],
    ['calc(100vw - 40px)', '50vh', 'calc(100vw - 40px)', '50vh'],
  ])('normalizes dimensions %s × %s on the outer box', async (width, height, expectedWidth, expectedHeight) => {
    await render({ width, height })
    expect(popup().style.width).toBe(expectedWidth)
    expect(popup().style.height).toBe(expectedHeight)
    expect(getComputedStyle(popup()).minWidth).toBe('0')
    expect(getComputedStyle(popup()).maxWidth).toBe('calc(1024px - 16px)')
    expect(getComputedStyle(popup()).boxSizing).toBe('border-box')
  })
  it('keeps the arrow and outer chrome outside the content scroll container', async () => {
    await render({ width: 180, height: 90, content: '滚动内容'.repeat(100) })
    const content = popup().querySelector<HTMLElement>('.zt-popover__content')!
    const arrow = popup().querySelector<HTMLElement>('.zt-popover__arrow')!
    expect(getComputedStyle(popup()).display).toBe('flex')
    expect(getComputedStyle(popup()).flexDirection).toBe('column')
    expect(getComputedStyle(popup()).overflow).not.toMatch(/auto|scroll|hidden/)
    expect(getComputedStyle(content).overflow).toBe('auto')
    expect(getComputedStyle(content).minHeight).toBe('0')
    expect(content.contains(arrow)).toBe(false)
    expect(getComputedStyle(arrow).position).toBe('absolute')
  })
  it('repositions and realigns its arrow immediately after dimension/placement props change', async () => {
    const wrapper = await render({ width: 100, height: 40, placement: 'top' })
    vi.spyOn(wrapper.get('.zt-popover__reference').element, 'getBoundingClientRect').mockReturnValue(new DOMRect(200, 180, 40, 20))
    vi.spyOn(popup(), 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, parseFloat(popup().style.width), parseFloat(popup().style.height)))
    await wrapper.setProps({ width: 180, height: 60 })
    await nextTick()
    expect(popup().style.left).toBe('130px')
    expect(popup().style.top).toBe('112px')
    expect(popup().style.getPropertyValue('--zt-popover-arrow-x')).toBe('90px')
    await wrapper.setProps({ placement: 'bottom' })
    await nextTick()
    expect(popup().style.top).toBe('208px')
  })
  it('repositions on asynchronous slot growth and trigger resizing, then disconnects observers', async () => {
    // Happy DOM does not perform layout or deliver ResizeObserver entries.
    // This double supplies browser measurement notifications; assertions target geometry.
    const observers: { targets: Set<Element>; notify: () => void }[] = []
    vi.stubGlobal('ResizeObserver', class {
      targets = new Set<Element>()
      constructor(callback: () => void) { observers.push({ targets: this.targets, notify: callback }) }
      observe(target: Element) { this.targets.add(target) }
      disconnect() { this.targets.clear() }
    })
    const text = ref('短提示')
    const wrapper = mount(ZtTooltip, { attachTo: document.body, props: { visible: true }, slots: { default: () => h('button', '触发'), content: () => h('span', text.value) } })
    wrappers.push(wrapper)
    await nextTick(); await nextTick()
    const reference = wrapper.get('.zt-popover__reference').element
    let triggerX = 200
    vi.spyOn(reference, 'getBoundingClientRect').mockImplementation(() => new DOMRect(triggerX, 180, 40, 20))
    vi.spyOn(popup(), 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, text.value.length > 5 ? 240 : 80, 60))
    text.value = '异步返回的较长提示内容'
    await nextTick()
    for (const observer of observers) if (observer.targets.has(popup()) || observer.targets.has(popup().querySelector('.zt-popover__content')!)) observer.notify()
    await nextTick()
    expect(popup().style.left).toBe('100px')
    expect(popup().style.top).toBe('112px')
    triggerX = 300
    for (const observer of observers) if (observer.targets.has(reference)) observer.notify()
    await nextTick()
    expect(popup().style.left).toBe('200px')
    await wrapper.setProps({ visible: false })
    expect(observers.every(observer => observer.targets.size === 0)).toBe(true)
    await wrapper.setProps({ visible: true })
    await nextTick(); await nextTick()
    expect(observers.some(observer => observer.targets.has(popup()))).toBe(true)
    wrapper.unmount(); wrappers.length = 0
    expect(observers.every(observer => observer.targets.size === 0)).toBe(true)
  })
})
