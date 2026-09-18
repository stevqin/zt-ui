import { mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { compile } from 'sass'
import { h } from 'vue'
import { ZtBadge, ZtConfigProvider } from '../src'

let styles: HTMLStyleElement
const wrappers: VueWrapper[] = []

beforeAll(() => {
  styles = document.createElement('style')
  styles.textContent = compile('src/components/badge/badge.scss').css
  document.head.append(styles)
})
afterAll(() => styles.remove())
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

function render(borderRadius: number, props: Record<string, unknown> = {}) {
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body,
    props: { borderRadius },
    slots: { default: () => h(ZtBadge, { value: 8, ...props }) },
  })
  wrappers.push(wrapper)
  return wrapper.get('.zt-badge__content')
}

describe('Badge circle geometry', () => {
  it.each([
    ['mini', '16px'],
    ['small', '18px'],
    ['default', '20px'],
    ['medium', '22px'],
    ['large', '24px'],
  ] as const)('defaults to a radius-independent circle at %s size', (size, diameter) => {
    const badge = render(0, { size })
    const css = getComputedStyle(badge.element)
    expect(badge.classes()).toContain('is-circle')
    expect(css.height).toBe(diameter)
    expect(css.minWidth).toBe(diameter)
    expect(css.borderRadius).toBe('999px')
  })

  it('lets circle=false inherit the configured radius', () => {
    const badge = render(0, { circle: false })
    expect(badge.classes()).not.toContain('is-circle')
    expect(getComputedStyle(badge.element).borderRadius).toContain('0px')
  })

  it('keeps dot mode circular even when circle=false', () => {
    const badge = render(0, { circle: false, isDot: true })
    expect(getComputedStyle(badge.element).borderRadius).toBe('50%')
  })
})
