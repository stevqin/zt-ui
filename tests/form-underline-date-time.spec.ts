import { compile } from 'sass'
import { h, nextTick, type Component } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker, ZtTimePicker, ZtTimeSelect, ZtForm, ZtFormItem, ZtConfigProvider, ZtSelect } from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const controls = [
  ['DatePicker', ZtDatePicker, '.zt-date-picker', '.zt-date-picker', '.zt-date-picker__panel'],
  ['DateTimePicker', ZtDateTimePicker, '.zt-date-picker', '.zt-date-picker', '.zt-date-picker__panel'],
  ['TimePicker', ZtTimePicker, '.zt-time-picker', '.zt-input__wrapper', '.zt-time-picker__panel'],
  ['TimeSelect', ZtTimeSelect, '.zt-select', '.zt-select__control', '.zt-select__dropdown'],
] as const
const wrappers: VueWrapper[] = []
const sheet = document.createElement('style')
beforeAll(() => {
  sheet.textContent = ['input/input', 'select/select', 'date-picker/date-picker', 'time-picker/time-picker', 'autocomplete/status', 'form/form']
    .map(path => compile(`src/components/${path}.scss`).css).join('\n')
    .replaceAll(':focus-within', '.test-focus-within').replaceAll(':hover', '.test-hover')
  document.head.append(sheet)
})
afterAll(() => sheet.remove())
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); resetOverlayManager(); document.body.innerHTML = '' })
function form(component: Component, props = {}, formProps = {}, itemProps = {}) {
  const w = mount(ZtForm, { attachTo: document.body, props: { underline: true, ...formProps },
    slots: { default: () => h(ZtFormItem, itemProps, () => h(component, props)) } })
  wrappers.push(w)
  return w
}
const css = (w: VueWrapper, selector: string) => getComputedStyle(w.get(selector).element)
function pointerAndFocus(w: VueWrapper) {
  const target = w.get<HTMLInputElement>('input').element
  target.focus()
  let parent: HTMLElement | null = target
  while (parent && parent !== document.body) { parent.classList.add('test-focus-within', 'test-hover'); parent = parent.parentElement }
}

describe('date and time Form underline boundaries', () => {
  it.each(controls)('%s marks its public root and reacts to Form changes while keeping its public API', async (_, component, root, surface) => {
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
    expect(css(w, surface).borderTopWidth).toBe('1px')
    expect('underline' in component.props).toBe(true)
  })

  it.each(controls)('%s preserves all five heights while focused and opened', async (_, component, root, surface, panel) => {
    for (const [size, height] of [['mini', '26px'], ['small', '30px'], ['default', '34px'], ['medium', '36px'], ['large', '40px']] as const) {
      const w = form(component, {}, { size })
      const before = css(w, surface)
      const geometry = [before.height, before.minHeight, before.paddingTop, before.paddingBottom]
      expect(before.height || before.minHeight).toBe(height)
      pointerAndFocus(w)
      await nextTick()
      expect(css(w, surface).boxShadow).toContain('inset 0 -1px 0')
      w.getComponent(component).vm.open()
      await flushPromises()
      expect(document.querySelector(panel)).not.toBeNull()
      const opened = css(w, surface)
      expect([opened.height, opened.minHeight, opened.paddingTop, opened.paddingBottom]).toEqual(geometry)
      expect(opened.borderBottomWidth).toBe('1px')
      expect(opened.boxShadow).toContain('inset 0 -1px 0')
      // The nested primitive stays below the public appearance owner.
      if (root === '.zt-time-picker') expect(w.get('.zt-input').classes()).not.toContain('is-form-underline')
      w.unmount()
    }
  })

  it.each(controls)('%s keeps disabled lines dashed and cannot open', async (_, component, _root, surface, panel) => {
    const w = form(component, { underline: true }, { disabled: true, underline: false }, { prop: 'value', error: '错误' })
    expect(w.get('input').attributes('disabled')).toBeDefined()
    expect(css(w, surface).borderBottomStyle).toBe('dashed')
    expect(css(w, surface).backgroundColor).toBe('transparent')
    expect(css(w, surface).boxShadow).toBe('none')
    w.getComponent(component).vm.open()
    await flushPromises()
    expect(document.querySelector(panel)).toBeNull()
  })

  it.each(controls)('%s keeps validation color on nested hover, focus and open', async (_, component, _root, surface) => {
    for (const [state, color] of [['error', '#ef4444'], ['success', '#22c55e']] as const) {
      const w = form(component, { underline: true }, { underline: false, model: { value: 'ok' } }, { prop: 'value', required: true, ...(state === 'error' ? { error: '错误' } : {}) })
      if (state === 'success') await w.vm.validate()
      w.findAll('div').forEach(el => el.element.classList.add('test-hover'))
      expect(css(w, surface).borderBottomColor).toBe(color)
      pointerAndFocus(w)
      await nextTick()
      expect(css(w, surface).borderBottomColor).toBe(color)
      expect(css(w, surface).boxShadow).toContain(color)
      w.getComponent(component).vm.open()
      await flushPromises()
      expect(css(w, surface).boxShadow).toContain(color)
      w.unmount()
    }
  })

  it.each(controls)('%s leaves popup internals identical to an ordinary Form', async (_, component, _root, _surface, panel) => {
    const w = form(component, {}, { underline: false })
    w.getComponent(component).vm.open()
    await flushPromises()
    const popup = document.querySelector(panel)!
    expect(popup).not.toBeNull()
    const snapshot = () => [popup, ...popup.querySelectorAll('input, button, .zt-select__search-input')].map(el => {
      const s = getComputedStyle(el)
      return [s.borderTopWidth, s.borderRadius, s.backgroundColor, s.boxShadow]
    })
    const before = snapshot()
    await w.setProps({ underline: true })
    expect(snapshot()).toEqual(before)
    expect(popup.querySelector('.is-form-underline')).toBeNull()
    if (component === ZtDateTimePicker) expect(getComputedStyle(popup.querySelector('input')!).borderTopWidth).toBe('1px')
  })

  it.each(controls)('%s supports keyboard opening, Escape and clear', async (_, component, _root, _surface, panel) => {
    const date = component === ZtDatePicker || component === ZtDateTimePicker
    const value = date ? (component === ZtDateTimePicker ? '2026-09-18 09:30:00' : '2026-09-18') : '09:30'
    const w = form(component, { modelValue: value, clearable: true })
    await w.get('input').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    expect(document.querySelector(panel)).not.toBeNull()
    const popup = document.querySelector(panel)!
    popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    // Select handles escape on its combobox; all other pickers support panel escape.
    if (component === ZtTimeSelect) await w.get('input').trigger('keydown', { key: 'Escape' })
    await flushPromises()
    expect(document.querySelector(panel)).toBeNull()
    await w.get(date ? '.zt-date-picker__clear' : component === ZtTimePicker ? '.zt-time-picker__clear' : '.zt-select__clear').trigger('click')
    expect(w.getComponent(component).emitted('update:modelValue')).toEqual([[null]])
    expect(w.getComponent(component).emitted('clear')).toHaveLength(1)
    if (date) expect(w.get('.zt-date-picker__icon').exists()).toBe(true)
    else if (component === ZtTimePicker) expect(w.text()).toContain('◷')
  })

  it.each([ZtDatePicker, ZtDateTimePicker, ZtTimePicker])('preserves range display and separator for %s', component => {
    const values = component === ZtTimePicker ? ['09:00', '18:00'] : component === ZtDateTimePicker ? ['2026-09-18 09:00:00', '2026-09-19 18:00:00'] : ['2026-09-18', '2026-09-19']
    const w = form(component, { range: true, modelValue: values })
    expect(w.get<HTMLInputElement>('input').element.value).toBe(values.join(' 至 '))
  })

  it.each(['light', 'dark'] as const)('uses the %s theme without inheriting radius on date/time surfaces', theme => {
    const w = mount(ZtConfigProvider, { attachTo: document.body, props: { theme, borderRadius: 18 }, slots: {
      default: () => h(ZtForm, { underline: true }, () => controls.map(([, component]) => h(component))),
    } })
    wrappers.push(w)
    for (const surface of w.findAll('.zt-date-picker, .zt-input__wrapper, .zt-select__control')) {
      expect(getComputedStyle(surface.element).borderRadius).toBe('0px')
      expect(getComputedStyle(surface.element).backgroundColor).toBe('transparent')
    }
  })

  it('lets TimeSelect own the boundary instead of relying on the nested Select', () => {
    const w = form(ZtTimeSelect)
    const select = w.getComponent(ZtSelect)
    expect(select.vm.$attrs.class).toContain('is-form-underline')
  })
})

it.each(controls)('%s explicit false restores the outlined surface inside an underline Form', (_, component, _root, surface) => {
  const w = form(component, { underline: false })
  expect(w.find('.is-form-underline').exists()).toBe(false)
  expect(css(w, surface).borderTopWidth).toBe('1px')
})

it.each(controls)('%s local override leaves open popup surfaces unchanged', async (_, component, _root, _surface, panel) => {
  const w = mount(component, { attachTo: document.body, props: { underline: true } })
  wrappers.push(w)
  w.vm.open()
  await flushPromises()
  const popup = document.querySelector(panel)!
  expect(popup).not.toBeNull()
  const snapshot = () => [popup, ...popup.querySelectorAll('input, button')].map(el => {
    const s = getComputedStyle(el)
    return [s.borderTopWidth, s.borderRadius, s.backgroundColor, s.boxShadow]
  })
  const before = snapshot()
  await w.setProps({ underline: false })
  expect(snapshot()).toEqual(before)
  await w.setProps({ underline: undefined })
  expect(snapshot()).toEqual(before)
  expect(popup.querySelector('.is-form-underline')).toBeNull()
})
