import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { compile } from 'sass'
import { afterEach, describe, expect, it } from 'vitest'
import ZtButton from '../src/components/button/ZtButton.vue'

const css = compile('src/components/button/button.scss').css.replaceAll(':hover', '.test-hover').replaceAll(':active', '.test-active')
const style = document.createElement('style')
let wrapper: ReturnType<typeof mount> | undefined
afterEach(() => {
  wrapper?.unmount()
  style.remove()
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference'
})
describe('dialog close icon animation', () => {
  it.each([false, true])('preserves close feedback with reduced motion=%s', reduced => {
    window.happyDOM.settings.device.prefersReducedMotion = reduced ? 'reduce' : 'no-preference'
    style.textContent = css
    document.head.append(style)
    wrapper = mount(ZtButton, {
      attachTo: document.body, props: { circle: true }, attrs: { 'aria-label': '关闭' },
      slots: { default: () => h('svg') },
    })
    const button = wrapper.element
    const idleColor = getComputedStyle(button).color
    button.classList.add('test-hover')
    expect(getComputedStyle(button).color).not.toBe(idleColor)
    expect(getComputedStyle(wrapper.get('svg').element).transform).toBe(reduced ? 'none' : 'rotate(90deg)')
    const hoverBackground = getComputedStyle(button).backgroundColor
    button.classList.add('test-active')
    expect(getComputedStyle(button).backgroundColor).not.toBe(hoverBackground)
  })
})
