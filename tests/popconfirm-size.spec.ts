import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { compile } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtButton, ZtConfigProvider, ZtPopconfirm } from '../src'
import type { ZtComponentSize } from '../src'

const wrappers: VueWrapper[] = []
const renderedProps = new WeakMap<VueWrapper, { size?: ZtComponentSize; buttonSize?: ZtComponentSize }>()
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = ['popover/popover', 'popconfirm/popconfirm', 'button/button'].map(path => compile(`src/components/${path}.scss`).css).join('\n')
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()); document.body.innerHTML = '' })

async function render(size?: ZtComponentSize, inherited: ZtComponentSize = 'default', buttonSize?: ZtComponentSize) {
  const props = reactive({ visible: true, title: '确认操作？', description: '请核对信息', size, buttonSize })
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body, props: { size: inherited },
    slots: { default: () => h(ZtPopconfirm, props, () => h(ZtButton, {}, () => '操作')) },
  })
  renderedProps.set(wrapper, props)
  wrappers.push(wrapper)
  await nextTick(); await nextTick()
  return wrapper
}
function controls(wrapper: VueWrapper) { return wrapper.findAllComponents(ZtButton).slice(-2).map(button => button.props('size')) }

const sizes = [
  ['mini', '10px', '12px', '11px', '16px'],
  ['small', '13px', '13px', '12px', '18px'],
  ['default', '16px', '14px', '13px', '20px'],
  ['medium', '18px', '15px', '14px', '22px'],
  ['large', '20px', '16px', '15px', '24px'],
] as const

describe('Popconfirm density propagation', () => {
  it.each(sizes)('applies %s to the surface, text, icon, both buttons and trigger scope', async (size, padding, title, description, icon) => {
    const wrapper = await render(size)
    const popup = document.querySelector<HTMLElement>('.zt-popover')!
    expect(popup.classList.contains(`zt-popover--confirm-${size}`)).toBe(true)
    expect(getComputedStyle(popup).padding).toBe(padding)
    expect(getComputedStyle(popup.querySelector('strong')!).fontSize).toBe(title)
    expect(getComputedStyle(popup.querySelector('p')!).fontSize).toBe(description)
    expect(getComputedStyle(popup.querySelector('.zt-popconfirm__icon')!).fontSize).toBe(icon)
    expect(controls(wrapper)).toEqual([size, size])
    if (size !== 'default') expect(wrapper.findAllComponents(ZtButton)[0]!.classes()).toContain(`zt-button--${size}`)
    expect(popup.hasAttribute('size')).toBe(false)
  })

  it('inherits reactive ConfigProvider size when size is omitted', async () => {
    const wrapper = await render(undefined, 'large')
    expect(controls(wrapper)).toEqual(['large', 'large'])
    await wrapper.setProps({ size: 'mini' })
    expect(controls(wrapper)).toEqual(['mini', 'mini'])
    expect(document.querySelector('.zt-popover--confirm-mini')).not.toBeNull()
  })

  it('prioritizes explicit size over the provider and button-size over size', async () => {
    const wrapper = await render('large', 'mini', 'small')
    expect(document.querySelector('.zt-popover--confirm-large')).not.toBeNull()
    expect(controls(wrapper)).toEqual(['small', 'small'])
    const props = renderedProps.get(wrapper)!
    props.buttonSize = undefined
    await nextTick()
    expect(controls(wrapper)).toEqual(['large', 'large'])
    props.size = undefined
    await nextTick()
    expect(controls(wrapper)).toEqual(['mini', 'mini'])
  })
})
