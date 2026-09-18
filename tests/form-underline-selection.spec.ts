import { compile } from 'sass'
import { h, nextTick, type Component } from 'vue'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtForm, ZtFormItem, ZtSelect, ZtSelectBox, ZtInputTag, ZtAutocomplete, ZtCascader, ZtTreeSelect, ZtConfigProvider, ZtInput } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const controls = [
  ['Select', ZtSelect, '.zt-select', '.zt-select__control'],
  ['SelectBox', ZtSelectBox, '.zt-select-box', '.zt-select-box__trigger'],
  ['InputTag', ZtInputTag, '.zt-input-tag', '.zt-input-tag'],
  ['Autocomplete', ZtAutocomplete, '.zt-entry', '.zt-input__wrapper'],
  ['Cascader', ZtCascader, '.zt-cascader', '.zt-hierarchy__control'],
  ['TreeSelect', ZtTreeSelect, '.zt-tree-select', '.zt-hierarchy__control'],
] as const
const wrappers: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = ['input/input', 'select/select', 'select-box/select-box', 'input-tag/input-tag', 'autocomplete/entry', 'tree-select/tree-select', 'autocomplete/status', 'form/form']
    .map(path => compile(`src/components/${path}.scss`).css).join('\n')
    // Happy DOM does not match focus-within. Mirror the focused input's ancestors.
    .replaceAll(':focus-within', '.test-focus-within').replaceAll(':hover', '.test-hover')
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); resetOverlayManager(); document.body.innerHTML = '' })
function form(component: Component, props = {}, formProps = {}, itemProps = {}) {
  const w = mount(ZtForm, { attachTo: document.body, props: { underline: true, ...formProps },
    slots: { default: () => h(ZtFormItem, itemProps, () => h(component, props)) } })
  wrappers.push(w)
  return w
}
const css = (w: VueWrapper, selector: string) => getComputedStyle(w.get(selector).element)
async function focus(w: VueWrapper) {
  const target = w.get<HTMLElement>('input, button').element
  target.focus()
  let parent: HTMLElement | null = target
  while (parent && parent !== document.body) { parent.classList.add('test-focus-within'); parent = parent.parentElement }
  await nextTick()
}

describe('selection controls own the Form underline boundary', () => {
  it.each(controls)('only marks the public %s root and responds to Form changes', async (_, component, root, surface) => {
    const w = form(component)
    expect(w.get(root).classes()).toContain('is-form-underline')
    expect(w.findAll('.is-form-underline')).toHaveLength(1)
    expect(css(w, surface).borderTopWidth).toBe('0px')
    expect(css(w, surface).borderRightWidth).toBe('0px')
    expect(css(w, surface).borderBottomWidth).toBe('1px')
    expect(css(w, surface).borderRadius).toBe('0px')
    expect(css(w, surface).backgroundColor).toBe('transparent')
    await w.setProps({ underline: false })
    expect(w.find('.is-form-underline').exists()).toBe(false)
    expect('underline' in component.props).toBe(true)
    expect(css(w, component === ZtInputTag ? '.zt-input__wrapper' : surface).borderTopWidth).toBe('1px')
  })

  it.each(controls)('%s retains every size and paints focus inward without resizing', async (_, component, _root, surface) => {
    for (const size of ['mini', 'small', 'default', 'medium', 'large'] as const) {
      const w = form(component, {}, { size })
      const before = css(w, surface)
      const geometry = [before.height, before.minHeight, before.paddingTop, before.paddingBottom]
      await focus(w)
      const after = css(w, surface)
      expect(after.boxShadow).toContain('inset 0 -1px 0')
      expect(after.borderBottomWidth).toBe('1px')
      expect([after.height, after.minHeight, after.paddingTop, after.paddingBottom]).toEqual(geometry)
      const sizedRoot = component === ZtAutocomplete ? '.zt-input' : _root
      if (size !== 'default') expect(w.get(sizedRoot).classes()).toContain(`${sizedRoot.slice(1)}--${size}`)
    }
  })

  it.each(controls)('%s keeps disabled surfaces dashed even in an error Form item', async (_, component, _root, surface) => {
    const w = form(component, { underline: true }, { disabled: true, underline: false }, { prop: 'value', error: '错误' })
    expect(w.get('input, button').attributes('disabled')).toBeDefined()
    expect(css(w, surface).borderBottomStyle).toBe('dashed')
    expect(css(w, surface).boxShadow).toBe('none')
    expect(css(w, surface).backgroundColor).toBe('transparent')
  })

  it.each(controls)('%s preserves error accessibility and validation focus color', async (_, component, _root, surface) => {
    const w = form(component, { underline: true }, { underline: false }, { prop: 'value', error: '错误' })
    expect(w.get('input, button').attributes('aria-invalid')).toBe('true')
    expect(w.get('input, button').attributes('aria-describedby')).toBeTruthy()
    w.get(_root).element.classList.add('test-hover')
    w.findAll('.zt-input').forEach(input => input.element.classList.add('test-hover'))
    expect(css(w, surface).borderBottomColor).toBe('#ef4444')
    await focus(w)
    expect(css(w, surface).borderBottomColor).toBe('#ef4444')
    expect(css(w, surface).boxShadow).toContain('#ef4444')
  })

  it.each(controls)('%s preserves successful validation during focus', async (_, component, _root, surface) => {
    const w = form(component, {}, { model: { value: 'ok' } }, { prop: 'value', required: true })
    await w.vm.validate()
    w.get(_root).element.classList.add('test-hover')
    w.findAll('.zt-input').forEach(input => input.element.classList.add('test-hover'))
    expect(css(w, surface).borderBottomColor).toBe('#22c55e')
    await focus(w)
    expect(css(w, surface).borderBottomColor).toBe('#22c55e')
    expect(css(w, surface).boxShadow).toContain('#22c55e')
  })

  it('treats InputTag as one underline surface while keeping tag deletion functional', async () => {
    const w = form(ZtInputTag, { modelValue: ['杭州', '上海'], clearable: true })
    expect(css(w, '.zt-input__wrapper').borderBottomWidth).toBe('0px')
    expect(css(w, '.zt-input__wrapper').boxShadow).toBe('none')
    await focus(w)
    expect(css(w, '.zt-input__wrapper').boxShadow).toBe('none')
    await w.get('[aria-label="删除 杭州"]').trigger('click')
    expect(w.getComponent(ZtInputTag).emitted('update:modelValue')).toEqual([[['上海']]])
  })

  it.each([true, false])('keeps hierarchy search outlined with teleported=%s', async teleported => {
    for (const component of [ZtCascader, ZtTreeSelect]) {
      const w = form(component, { underline: true, teleported, filterable: true }, { underline: false })
      await w.get('.zt-hierarchy__control').trigger('click')
      await flushPromises()
      const search = document.querySelector('.zt-hierarchy__search')!
      expect(search).not.toBeNull()
      expect(search.classList.contains('is-form-underline')).toBe(false)
      expect(getComputedStyle(search).borderTopWidth).toBe('1px')
      w.unmount()
    }
  })

  it('keeps Select popup search and slotted helper inputs outlined', async () => {
    const w = mount(ZtForm, { attachTo: document.body, props: { underline: true }, slots: {
      default: () => h(ZtSelect, { underline: true, multiple: true, filterable: true }, { footer: () => h(ZtInput) }),
    } })
    wrappers.push(w)
    await w.get('.zt-select__input').trigger('click')
    await flushPromises()
    const popup = document.querySelector('.zt-select__dropdown')!
    expect(popup.querySelector('.is-form-underline')).toBeNull()
    for (const el of popup.querySelectorAll('.zt-select__search-input, .zt-input__wrapper')) expect(getComputedStyle(el).borderTopWidth).toBe('1px')
  })

  it('keeps Autocomplete suggestion slot inputs outlined', async () => {
    const w = mount(ZtForm, { attachTo: document.body, props: { underline: true }, slots: {
      default: () => h(ZtAutocomplete, { underline: true, options: [{ value: '杭州' }], debounce: 0 }, { option: () => h(ZtInput) }),
    } })
    wrappers.push(w)
    await w.get('input').trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 5))
    await flushPromises()
    const popup = document.querySelector('.zt-entry__list')!
    expect(popup).not.toBeNull()
    expect(popup.querySelector('.is-form-underline')).toBeNull()
    expect(getComputedStyle(popup.querySelector('.zt-input__wrapper')!).borderTopWidth).toBe('1px')
  })

  it.each(['light', 'dark'] as const)('uses %s provider status tokens for compact InputTag tags', theme => {
    const w = mount(ZtConfigProvider, { attachTo: document.body, props: { theme, borderRadius: 18 }, slots: {
      default: () => h(ZtForm, { underline: true }, () => h(ZtInputTag, { status: 'warning', modelValue: ['杭州'] })),
    } })
    wrappers.push(w)
    const tag = css(w, '.zt-input-tag__tag')
    expect(tag.borderTopWidth).toBe('0px')
    expect(tag.backgroundColor).not.toBe('transparent')
    expect(tag.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(tag.backgroundColor).toBe(getComputedStyle(w.element).getPropertyValue('--zt-warning-soft'))
  })
})


it('keeps the inner InputTag input borderless without a FormItem during focus', async () => {
  const w = mount(ZtForm, { attachTo: document.body, props: { underline: true }, slots: { default: () => h(ZtInputTag) } })
  wrappers.push(w)
  await focus(w)
  expect(css(w, '.zt-input__wrapper').boxShadow).toBe('none')
  expect(css(w, '.zt-input__wrapper').borderBottomWidth).toBe('0px')
})

it('preserves SelectBox internal surface styles when its Form appearance changes', async () => {
  const w = form(ZtSelectBox, { options: [{ value: 0, label: '杭州' }] }, { underline: false })
  await w.get('.zt-select-box__trigger').trigger('click')
  await flushPromises()
  const popup = document.querySelector('.zt-select-box__popup')!
  const snapshot = (selectors: string[]) => selectors.map(selector => {
    const el = popup.querySelector(selector)!
    expect(el).not.toBeNull()
    const s = getComputedStyle(el)
    return [s.borderTopWidth, s.borderBottomWidth, s.borderRadius, s.backgroundColor, s.boxShadow]
  })
  const searchAndPager = ['.zt-input__wrapper', '.zt-select__control']
  const before = snapshot(searchAndPager)
  await w.setProps({ underline: true })
  expect(snapshot(searchAndPager)).toEqual(before)
  expect(before.every(s => s[0] === '1px')).toBe(true)
  popup.querySelector<HTMLButtonElement>('.zt-select-box-panel__mode')!.click()
  await flushPromises()
  const pasteAndSeparator = ['.zt-select-box-panel__paste-editor', 'textarea', '.zt-select__control']
  const batch = snapshot(pasteAndSeparator)
  await w.setProps({ underline: false })
  expect(snapshot(pasteAndSeparator)).toEqual(batch)
  expect(batch[0]![0]).toBe('1px')
  expect(popup.querySelector('.is-form-underline')).toBeNull()
})


it('preserves ordinary Autocomplete nested-input hover and underline focus', async () => {
  const w = form(ZtAutocomplete)
  w.get('.zt-entry').element.classList.add('test-hover')
  w.get('.zt-input').element.classList.add('test-hover')
  expect(css(w, '.zt-input__wrapper').borderBottomColor).toBe('#bfd2ff')
  await focus(w)
  expect(css(w, '.zt-input__wrapper').borderBottomColor).toBe('#245edb')
  expect(css(w, '.zt-input__wrapper').boxShadow).toContain('inset 0 -1px 0')
})

it.each(controls)('%s explicit false restores the outlined surface inside an underline Form', (_, component, _root, surface) => {
  const w = form(component, { underline: false })
  expect(w.find('.is-form-underline').exists()).toBe(false)
  expect(css(w, component === ZtInputTag ? ".zt-input__wrapper" : surface).borderTopWidth).toBe('1px')
})
