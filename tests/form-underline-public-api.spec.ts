import ts from 'typescript'
import { resolve } from 'node:path'
import { h, nextTick, ref, type Component } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import * as library from '../src'
import { ZtForm, ZtInput } from '../src'
import ZtDatePickerBase from '../src/components/date-picker/ZtDatePickerBase.vue'

const controls = [
  ['Input', library.ZtInput, '.zt-input'],
  ['Password', library.ZtPassword, '.zt-password'],
  ['InputNumber', library.ZtInputNumber, '.zt-input-number'],
  ['InputTag', library.ZtInputTag, '.zt-input-tag'],
  ['InputOtp', library.ZtInputOtp, '.zt-input-otp'],
  ['Select', library.ZtSelect, '.zt-select'],
  ['SelectBox', library.ZtSelectBox, '.zt-select-box'],
  ['Autocomplete', library.ZtAutocomplete, '.zt-entry'],
  ['Cascader', library.ZtCascader, '.zt-cascader'],
  ['TreeSelect', library.ZtTreeSelect, '.zt-tree-select'],
  ['DatePicker', library.ZtDatePicker, '.zt-date-picker'],
  ['DateTimePicker', library.ZtDateTimePicker, '.zt-date-picker'],
  ['TimePicker', library.ZtTimePicker, '.zt-time-picker'],
  ['TimeSelect', library.ZtTimeSelect, '.zt-select'],
  ['Mention', library.ZtMention, '.zt-mention'],
] as const
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
function render(component: Component, props: Record<string, unknown> = {}) {
  const wrapper = mount(component, { props })
  wrappers.push(wrapper)
  return wrapper
}
function marked(wrapper: VueWrapper, root: string) {
  return wrapper.get(root).classes().includes('is-form-underline')
}

describe('public tri-state underline API', () => {
  it('exposes Form appearance only on Form and the 15 supported public controls', () => {
    const actual = Object.entries(library).filter(([name, component]) =>
      // Existing text-decoration APIs are unrelated to control appearance.
      !['ZtLink', 'ZtTypography'].includes(name) &&
      component && typeof component === 'object' && 'props' in component &&
      'underline' in (component.props as object),
    ).map(([name]) => name).sort()
    expect(actual).toEqual(['ZtForm', ...controls.map(([name]) => `Zt${name}`)].sort())
  })

  it('preserves unrelated Link and Typography text decoration', () => {
    const link = render(library.ZtLink, { underline: 'always' })
    expect(link.classes()).toContain('zt-link--underline-always')
    expect(link.find('.is-form-underline').exists()).toBe(false)
    const typography = render(library.ZtTypography, { underline: true, content: 'text' })
    expect(typography.find('.is-underline').exists()).toBe(true)
    expect(typography.find('.is-form-underline').exists()).toBe(false)
  })

  it('exports optional boolean types for all supported controls and excludes the date panel', () => {
    const program = ts.createProgram([resolve('src/index.ts')], {
      strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    })
    const checker = program.getTypeChecker()
    const source = program.getSourceFile(resolve('src/index.ts'))!
    const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(source)!)
    for (const [name] of controls) {
      const symbol = exports.find(symbol => symbol.name === `Zt${name}Props`)!
      expect(symbol, name).toBeDefined()
      const type = checker.getDeclaredTypeOfSymbol(symbol)
      const prop = type.getProperty('underline')
      expect(prop, name).toBeDefined()
      expect(prop!.flags & ts.SymbolFlags.Optional, name).toBeTruthy()
      expect(checker.typeToString(checker.getTypeOfSymbolAtLocation(prop!, source)), name).toBe('boolean | undefined')
    }
    const panel = exports.find(symbol => symbol.name === 'ZtDatePickerPanelProps')!
    expect(checker.getDeclaredTypeOfSymbol(panel).getProperty('underline')).toBeUndefined()
  })

  it.each(controls)('%s supports explicit true outside Form and reactive local changes', async (_, component, root) => {
    const wrapper = render(component, { underline: true })
    expect(marked(wrapper, root)).toBe(true)
    expect(wrapper.findAll('.is-form-underline')).toHaveLength(1)
    expect(wrapper.get(root).attributes('underline')).toBeUndefined()
    await wrapper.setProps({ underline: false })
    expect(marked(wrapper, root)).toBe(false)
    await wrapper.setProps({ underline: undefined })
    expect(marked(wrapper, root)).toBe(false)
    await wrapper.setProps({ underline: true })
    expect(marked(wrapper, root)).toBe(true)
  })

  it.each(controls)('%s gives explicit false precedence and resumes reactive inheritance when omitted', async (_, component, root) => {
    const local = ref<boolean | undefined>(false)
    const inherited = ref(true)
    const wrapper = render({ setup: () => () => h(ZtForm, { underline: inherited.value },
      () => h(component, { underline: local.value })) })
    expect(marked(wrapper, root)).toBe(false)
    local.value = undefined
    await nextTick()
    expect(marked(wrapper, root)).toBe(true)
    inherited.value = false
    await nextTick()
    expect(marked(wrapper, root)).toBe(false)
    local.value = true
    await nextTick()
    expect(marked(wrapper, root)).toBe(true)
    inherited.value = true
    await nextTick()
    expect(marked(wrapper, root)).toBe(true)
    local.value = false
    await nextTick()
    expect(marked(wrapper, root)).toBe(false)
  })

  it.each(controls)('%s inherits a nested Form reset below an existing public boundary', async (_, component, root) => {
    const nested = ref(false)
    const wrapper = render({ setup: () => () => h(ZtForm, { underline: true }, () =>
      h(ZtInput, null, { suffix: () => h(ZtForm, { underline: nested.value }, () =>
        h('section', { class: 'nested-control' }, h(component))) })) })
    const subject = wrapper.get('.nested-control')
    expect(subject.get(root).classes()).not.toContain('is-form-underline')
    nested.value = true
    await nextTick()
    expect(subject.get(root).classes()).toContain('is-form-underline')
    expect(subject.findAll('.is-form-underline')).toHaveLength(1)
  })

  it.each(controls)('%s honors a local override below another public control boundary', async (_, component, root) => {
    const local = ref<boolean | undefined>(true)
    const wrapper = render({ setup: () => () => h(ZtForm, { underline: true }, () =>
      h(ZtInput, null, { suffix: () => h('section', { class: 'nested-control' },
        h(component, { underline: local.value })) })) })
    const subject = wrapper.get('.nested-control')
    expect(subject.get(root).classes()).toContain('is-form-underline')
    local.value = undefined
    await nextTick()
    expect(subject.get(root).classes()).not.toContain('is-form-underline')
  })

  it.each([
    ['DatePicker', library.ZtDatePicker],
    ['DateTimePicker', library.ZtDateTimePicker],
  ])('%s keeps its local appearance prop out of the internal date implementation', (_, component) => {
    const wrapper = render(component, { underline: true })
    const child = wrapper.getComponent(ZtDatePickerBase)
    expect('underline' in child.props()).toBe(false)
    expect(child.vm.$attrs.underline).toBeUndefined()
    expect(child.vm.$attrs.class).toContain('is-form-underline')
  })

  it.each([
    ['Password', library.ZtPassword, library.ZtInput],
    ['TimeSelect', library.ZtTimeSelect, library.ZtSelect],
  ])('%s forwards only the resolved marker to its implementation control', (_, component, primitive) => {
    const wrapper = render(component, { underline: true })
    const child = wrapper.getComponent(primitive)
    expect(child.props('underline')).toBeUndefined()
    expect(child.vm.$attrs.class).toContain('is-form-underline')
  })
})
