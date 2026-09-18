import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { compileString } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtTag, ZtCheckbox, ZtCheckboxGroup, ZtSwitch, ZtForm, ZtFormItem, ZtImageViewer, ZtImage, ZtModal, ZtMenu, ZtCollapse, ZtCollapseItem, ZtSegmented } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = ['collapse/collapse', 'image/image', 'segmented/segmented'].map(file => compileString(`@use '${file}.scss';`, { loadPaths: [process.cwd() + '/src/components'] }).css).join('\n')
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).reverse().forEach(wrapper => wrapper.unmount())
  resetOverlayManager()
  document.body.innerHTML = ''
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference'
})
function render(component: Parameters<typeof mount>[0], options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(component, { attachTo: document.body, ...options })
  wrappers.push(wrapper)
  return wrapper
}

describe('selection control contract regressions', () => {
  it('a closable Tag exposes a named keyboard-accessible native button', () => {
    const tag = render(ZtTag, { props: { closable: true }, slots: { default: '筛选条件' } })
    const close = tag.get<HTMLButtonElement>('.zt-tag__close')
    expect(close.element.tagName).toBe('BUTTON')
    expect(close.element.tabIndex).toBe(0)
    expect(close.attributes('aria-label')).toBe('关闭标签')
    close.element.click()
    expect(tag.emitted('close')).toHaveLength(1)
  })
  it('Checkbox is natively focusable and emits when its native checked state changes', async () => {
    const wrapper = render(ZtCheckbox, { props: { label: '同意', indeterminate: true } })
    const input = wrapper.get<HTMLInputElement>('input')
    expect(input.element.tabIndex).toBe(0)
    expect(input.element.indeterminate).toBe(true)
    input.element.focus()
    expect(document.activeElement).toBe(input.element)
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
  it.each([
    { limit: 'min', index: 0, min: 1, max: 2, wanted: false, kept: true, accepted: [] },
    { limit: 'max', index: 1, min: 0, max: 1, wanted: true, kept: false, accepted: ['a', 'b'] },
  ])('Checkbox group restores native state after a $limit rejection and accepts a later allowed toggle', async ({ limit, index, min, max, wanted, kept, accepted }) => {
    const values = ref<unknown[]>(['a'])
    const mixed = ref(true)
    const group = render(ZtCheckboxGroup, {
      props: { min, max, modelValue: values.value, 'onUpdate:modelValue': (next: unknown[]) => {
        values.value = next
        mixed.value = false
        void group.setProps({ modelValue: next })
      } },
      slots: { default: () => ['a', 'b'].map(value => h(ZtCheckbox, { value, label: value, indeterminate: mixed.value })) },
    })
    const checkbox = group.findAllComponents(ZtCheckbox)[index]!
    const input = checkbox.get<HTMLInputElement>('input')
    // Native checkbox activation updates checked and clears indeterminate before
    // emitting change, even when a controlled group will reject that change.
    input.element.indeterminate = false
    await input.setValue(wanted)
    expect(values.value).toEqual(['a'])
    expect(group.emitted('update:modelValue')).toBeUndefined()
    expect(input.element.checked).toBe(kept)
    expect(input.element.indeterminate).toBe(true)
    expect(checkbox.classes().includes('is-checked')).toBe(kept)
    await group.setProps({ [limit]: limit === 'min' ? 0 : 2 })
    input.element.indeterminate = false
    await input.setValue(wanted)
    expect(values.value).toEqual(accepted)
    expect(input.element.checked).toBe(wanted)
    expect(input.element.indeterminate).toBe(false)
    expect(checkbox.classes().includes('is-checked')).toBe(wanted)
  })
  it('Checkbox group inherits Form density/disabled and prevents mutations', async () => {
    const wrapper = render(ZtForm, { props: { size: 'large', disabled: true }, slots: { default: () => h(ZtFormItem, {}, () => h(ZtCheckboxGroup, {}, () => h(ZtCheckbox, { value: 'a', label: 'A' }))) } })
    const checkbox = wrapper.getComponent(ZtCheckbox)
    expect(checkbox.classes()).toContain('zt-checkbox--large')
    expect(checkbox.get<HTMLInputElement>('input').element.disabled).toBe(true)
    await checkbox.get('input').trigger('change')
    expect(wrapper.getComponent(ZtCheckboxGroup).emitted('update:modelValue')).toBeUndefined()
  })
  it.each([' ', 'Enter'])('Switch supports keyboard %s and announces disabled/loading state', async key => {
    const wrapper = render(ZtSwitch, { attrs: { 'aria-label': '开关' } })
    expect((wrapper.element as HTMLElement).tabIndex).toBe(0)
    await wrapper.trigger('keydown', { key })
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.setProps({ loading: true })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('keydown', { key })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    await wrapper.setProps({ loading: false, disabled: true })
    expect((wrapper.element as HTMLElement).tabIndex).toBe(-1)
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })
  it('Switch inherits Form disabled and density', async () => {
    const wrapper = render(ZtForm, { props: { disabled: true, size: 'mini' }, slots: { default: () => h(ZtFormItem, {}, () => h(ZtSwitch)) } })
    const control = wrapper.getComponent(ZtSwitch)
    expect(control.classes()).toContain('zt-switch--mini')
    expect(control.attributes('aria-disabled')).toBe('true')
    await control.trigger('click')
    expect(control.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('Menu overlay ownership', () => {
  it.each(['double', 'horizontal'] as const)('%s flyout stays in its modal focus scope and Escape closes only the flyout', async mode => {
    const wrapper = render(ZtModal, { props: { modelValue: true, zIndex: 9000 }, slots: { default: () => h(ZtMenu, { mode, collapsed: true, menuTrigger: 'click', items: [{ key: 'sales', label: '销售', children: [{ key: 'orders', label: '订单' }] }] }) } })
    await nextTick()
    const trigger = document.querySelector<HTMLButtonElement>(mode === 'double' ? '[data-category="sales"]' : '[data-horizontal-key="sales"]')!
    trigger.click()
    await nextTick(); await nextTick()
    const popup = document.querySelector<HTMLElement>('.zt-menu__flyout')!
    const option = popup.querySelector<HTMLElement>('[role=menuitem]')!
    option.focus()
    expect(document.activeElement).toBe(option)
    expect(Number(popup.style.zIndex)).toBeGreaterThan(9000)
    option.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(document.querySelector('.zt-menu__flyout')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('ImageViewer overlay ownership', () => {
  it('restores the opener and traps keyboard focus for a standalone viewer', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const viewer = render(ZtImageViewer, { props: { urls: ['/a.svg'] } })
    await nextTick()
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('.zt-image-viewer button')]
    expect(document.activeElement).toBe(buttons[0])
    buttons.at(-1)!.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[0])
    viewer.unmount()
    await nextTick()
    expect(document.activeElement).toBe(opener)
  })
  it('only the top viewer consumes navigation/Escape when multiple viewers are open', async () => {
    const first = render(ZtImageViewer, { props: { urls: ['/a.svg', '/b.svg'] } })
    const second = render(ZtImageViewer, { props: { urls: ['/c.svg', '/d.svg'] } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }))
    await nextTick()
    expect(first.emitted('switch')).toBeUndefined()
    expect(second.emitted('switch')).toEqual([[1]])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    await nextTick()
    expect(first.emitted('close')).toBeUndefined()
    expect(second.emitted('close')).toHaveLength(1)
  })
  it('a modal above a viewer consumes Escape without closing the viewer', async () => {
    const viewer = render(ZtImageViewer, { props: { urls: ['/a.svg'] } })
    const open = ref(true)
    render({ render: () => h(ZtModal, { modelValue: open.value, 'onUpdate:modelValue': value => { open.value = value } }) })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    await nextTick()
    expect(open.value).toBe(false)
    expect(viewer.emitted('close')).toBeUndefined()
  })
})

it('Collapse, Segmented and Image families preserve feedback without reduced-motion transitions', async () => {
  window.happyDOM.settings.device.prefersReducedMotion = 'reduce'
  const css = style.textContent
  style.remove(); style.textContent = css; document.head.append(style)
  const collapse = render(ZtCollapse, { slots: { default: () => h(ZtCollapseItem, { name: 'a', title: '详情' }) } })
  expect(getComputedStyle(collapse.get('.zt-collapse-item__arrow').element).transition).toBe('none')
  await collapse.get('button').trigger('click')
  expect(collapse.emitted('update:modelValue')).toEqual([[['a']]])
  await collapse.setProps({ modelValue: ['a'] })
  expect(collapse.get('button').attributes('aria-expanded')).toBe('true')
  const segmented = render(ZtSegmented, { props: { options: ['a', 'b'] } })
  expect(getComputedStyle(segmented.get('button').element).transition).toBe('none')
  const image = render(ZtImage, { props: { src: '/a.svg', previewSrcList: ['/a.svg'] } })
  expect(getComputedStyle(image.get('.zt-image__preview-mask').element).transition).toBe('none')
  await image.trigger('click'); await nextTick()
  expect(getComputedStyle(document.querySelector('.zt-image-viewer img')!).transition).toBe('none')
})
