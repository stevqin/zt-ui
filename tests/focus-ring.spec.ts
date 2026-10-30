import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtConfigProvider, ZtButton, ZtModal, ZtImageViewer } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
function render(props: Record<string, unknown> = {}, content = () => h(ZtButton, {}, () => '按钮')) {
  const wrapper = mount(ZtConfigProvider, { props, slots: { default: content }, attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}
const width = (element: Element) => (element as HTMLElement).style.getPropertyValue('--zt-focus-ring-width')
describe('focus ring configuration', () => {
  it('defaults to none without changing tab order', () => {
    const w = render()
    expect(width(w.element)).toBe('0px')
    expect(w.get('button').attributes('tabindex')).not.toBe('-1')
  })
  it('tracks keyboard and pointer input rather than browser focus-visible heuristics', async () => {
    const w = render({ focusRing: 'keyboard' })
    expect(width(w.element)).toBe('0px')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    await nextTick()
    expect(width(w.element)).toBe('2px')
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(width(w.element)).toBe('0px')
  })
  it('keeps document tracking alive after the first provider is removed', async () => {
    const first = render({ focusRing: 'none' })
    render({ focusRing: 'keyboard' })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    await nextTick()
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe('0px')
    first.unmount(); wrappers.shift()
    await nextTick()
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe('2px')
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe('0px')
  })
  it('carries a nested override to the image viewer portal', async () => {
    render({}, () => h(ZtConfigProvider, { focusRing: 'all' }, () => h(ZtImageViewer, { urls: ['sample.svg'] })))
    await nextTick()
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe('0px')
    expect(width(document.querySelector('.zt-image-viewer')!)).toBe('2px')
  })
  it('updates nested and teleported components and restores global styles after unmount', async () => {
    const before = document.documentElement.style.getPropertyValue('--zt-focus-ring-width')
    const w = render({ focusRing: 'all' }, () => [
      h(ZtConfigProvider, {}, () => h(ZtButton, {}, () => '继承')),
      h(ZtConfigProvider, { focusRing: 'none' }, () => h(ZtButton, {}, () => '关闭')),
      h(ZtModal, { modelValue: true }, () => '浮层内容'),
    ])
    await nextTick()
    const providers = w.findAll('.zt-config-provider')
    expect(width(providers[1].element)).toBe('2px')
    expect(width(providers[2].element)).toBe('0px')
    expect(width(document.querySelector('.zt-modal')!)).toBe('2px')
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe('2px')
    await w.setProps({ focusRing: 'none' })
    expect(width(document.querySelector('.zt-modal')!)).toBe('0px')
    w.unmount(); wrappers.pop()
    expect(document.documentElement.style.getPropertyValue('--zt-focus-ring-width')).toBe(before)
  })
})
