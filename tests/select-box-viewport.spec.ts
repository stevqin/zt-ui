import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { compile } from 'sass'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteResult } from '../src/components/select-box/types'

const options = Array.from({ length: 25 }, (_, value) => ({ value, label: `选项 ${value}` }))
const wrappers: VueWrapper[] = []
let styles: HTMLStyleElement
let anchor = { left: 100, top: 100, width: 240, height: 34 }
let naturalHeight = () => 560
function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height, toJSON: () => ({}) }
}
const popup = () => document.querySelector<HTMLElement>('.zt-select-box__popup')!
async function open(props: ZtSelectBoxProps = {}) {
  const wrapper = mount(ZtSelectBox, { attachTo: document.body, props: { options, ...props } })
  wrappers.push(wrapper)
  await wrapper.get('.zt-select-box__trigger').trigger('click')
  await flushPromises()
  return wrapper
}
async function click(selector: string) {
  document.querySelector<HTMLElement>(selector)!.click()
  await flushPromises()
}
beforeAll(() => {
  styles = document.createElement('style')
  styles.textContent = ['select-box/select-box', 'scrollbar/scrollbar'].map(path => compile(`src/components/${path}.scss`).css).join('\n')
  document.head.append(styles)
  return () => styles.remove()
})
beforeEach(() => {
  vi.stubGlobal('innerWidth', 1000)
  vi.stubGlobal('innerHeight', 800)
  anchor = { left: 100, top: 100, width: 240, height: 34 }
  naturalHeight = () => 560
  // happy-dom has no layout. Model only the browser's measured rectangle and
  // max-height clipping; component placement and content transitions stay real.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('zt-select-box')) return rect(anchor.left, anchor.top, anchor.width, anchor.height)
    if (this.classList.contains('zt-select-box__popup')) {
      const limit = Number.parseFloat(this.style.maxHeight)
      return rect(Number.parseFloat(this.style.left) || 0, Number.parseFloat(this.style.top) || 0,
        Number.parseFloat(this.style.width) || 480, Math.min(naturalHeight(), Number.isFinite(limit) ? limit : Infinity))
    }
    return rect(0, 0, 0, 0)
  })
})
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('SelectBox viewport placement', () => {
  it.each([
    { top: 100, wantTop: '134px', maxHeight: '658px' },
    { top: 680, wantTop: '120px', maxHeight: '672px' },
    { top: 410, wantTop: '8px', maxHeight: '402px' },
    { top: 340, wantTop: '374px', maxHeight: '418px' },
  ])('fits or uses the larger side for trigger at $top', async ({ top, wantTop, maxHeight }) => {
    anchor.top = top
    await open()
    expect(popup().style.top).toBe(wantTop)
    expect(popup().style.maxHeight).toBe(maxHeight)
    expect(popup().style.position).toBe('fixed')
    const bounds = popup().getBoundingClientRect()
    expect(bounds.top).toBeGreaterThanOrEqual(8)
    expect(bounds.bottom).toBeLessThanOrEqual(792)
  })

  it('flips after clipping and re-expands on resize without retaining the clipped desired height', async () => {
    vi.stubGlobal('innerHeight', 300)
    await open()
    expect(popup().getBoundingClientRect().height).toBe(158)
    vi.stubGlobal('innerHeight', 800)
    anchor.top = 410
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(popup().style.top).toBe('8px')
    vi.stubGlobal('innerHeight', 1000)
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(popup().style.top).toBe('444px')
    expect(popup().getBoundingClientRect().height).toBe(548)
    vi.stubGlobal('innerHeight', 1200)
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(popup().getBoundingClientRect().height).toBe(560)
  })

  it('measures wrapped chrome at the clamped width on a narrow viewport', async () => {
    vi.stubGlobal('innerWidth', 320)
    anchor.left = 260
    anchor.top = 450
    naturalHeight = () => Number.parseFloat(popup()?.style.width || '480') <= 304 ? 500 : 300
    await open()
    expect(popup().style.width).toBe('304px')
    expect(popup().style.left).toBe('8px')
    expect(popup().style.top).toBe('8px')
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(792)
    anchor.top = 450
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(popup().style.top).toBe('8px')
    expect(popup().style.maxHeight).toBe('442px')
  })

  it('remeasures page, selected-only, paste, and content changes even while the popup size is clipped', async () => {
    anchor.top = 410
    naturalHeight = () => {
      if (document.querySelector('textarea')) return 330
      return document.querySelectorAll('.zt-select-box-panel__option').length <= 5 ? 260 : 560
    }
    const wrapper = await open({ modelValue: [0] })
    expect(popup().style.top).toBe('8px')
    await click('[aria-label="第 3 页"]')
    expect(popup().style.top).toBe('444px')
    await click('[aria-label="第 1 页"]')
    expect(popup().style.top).toBe('8px')
    await click('.zt-select-box-panel__view-selected')
    expect(popup().style.top).toBe('444px')
    await click('.zt-select-box-panel__view-selected')
    expect(popup().style.top).toBe('8px')
    await click('.zt-select-box-panel__mode')
    expect(popup().style.top).toBe('444px')
    await click('.zt-select-box-panel__mode')
    expect(popup().style.top).toBe('8px')
    await wrapper.setProps({ options: [] })
    await flushPromises()
    expect(popup().style.top).toBe('444px')
  })

  it('remeasures loading, result, error, and empty remote states', async () => {
    anchor.top = 410
    let resolve!: (value: ZtSelectBoxRemoteResult) => void
    let reject!: (reason: unknown) => void
    const remoteMethod = () => new Promise<ZtSelectBoxRemoteResult>((res, rej) => { resolve = res; reject = rej })
    naturalHeight = () => document.querySelector('.zt-select-box-panel__loading.is-loading, [role="alert"]') ? 280 : document.querySelectorAll('.zt-select-box-panel__option').length ? 560 : 240
    const wrapper = await open({ remote: true, remoteMethod })
    expect(popup().style.top).toBe('444px')
    resolve({ mode: 'search', options: options.slice(0, 10), total: 25 })
    await flushPromises()
    expect(popup().style.top).toBe('8px')
    await click('[aria-label="下一页"]')
    expect(popup().style.top).toBe('444px')
    reject(new Error('offline'))
    await flushPromises()
    expect(document.querySelector('[role="alert"]')).not.toBeNull()
    expect(popup().style.top).toBe('444px')
    await wrapper.setProps({ remoteMethod: async () => ({ mode: 'search', options: [], total: 0 }) })
    await flushPromises()
    expect(popup().style.top).toBe('444px')
    expect(document.querySelector('.zt-select-box-panel__state')?.textContent).toContain('暂无匹配选项')
  })
})

describe('SelectBox production overflow styles', () => {
  it('fixes popup, panel and chrome while the option list alone owns vertical scrolling', async () => {
    await open()
    for (const element of [popup(), popup().querySelector<HTMLElement>('.zt-select-box-panel')!]) {
      const css = getComputedStyle(element)
      expect(css.display).toBe('flex')
      expect(css.flexDirection).toBe('column')
      expect(css.minHeight).toBe('0')
      expect(css.overflow).toBe('hidden')
    }
    const list = popup().querySelector<HTMLElement>('.zt-select-box-panel__list')!
    expect(getComputedStyle(list).overflow).toBe('auto')
    expect(getComputedStyle(list).minHeight).toBe('0')
    expect(getComputedStyle(list).flexShrink).toBe('1')
    for (const name of ['header', 'pager', 'footer']) {
      const chrome = popup().querySelector<HTMLElement>(`.zt-select-box-panel__${name}`)!
      expect(getComputedStyle(chrome).flexShrink).toBe('0')
      expect(list.contains(chrome)).toBe(false)
    }
    expect(getComputedStyle(list.parentElement!).overflow).toBe('hidden')
    expect(getComputedStyle(list.parentElement!).minHeight).toBe('0')
  })

  it('keeps paste result, separator and actions outside its only scrollable editor', async () => {
    await open()
    await click('.zt-select-box-panel__mode')
    const editor = popup().querySelector<HTMLTextAreaElement>('textarea')!
    expect(editor.classList.contains('zt-select-box-panel__list')).toBe(true)
    expect(getComputedStyle(editor).overflow).toBe('auto')
    expect(getComputedStyle(editor).minHeight).toBe('0')
    expect(getComputedStyle(editor).resize).toBe('none')
    for (const name of ['paste', 'paste-editor']) {
      const css = getComputedStyle(popup().querySelector<HTMLElement>(`.zt-select-box-panel__${name}`)!)
      expect(css.overflow).toBe('hidden')
      expect(css.minHeight).toBe('0')
    }
    expect(getComputedStyle(popup().querySelector<HTMLElement>('.zt-select-box-panel__separator')!).flexShrink).toBe('0')
  })
})
