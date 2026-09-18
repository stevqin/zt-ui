import { compile } from 'sass'
import { h, nextTick, ref, type Component } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  ZtForm, ZtFormItem, ZtInput, ZtPassword, ZtInputNumber, ZtInputOtp, ZtMention,
  ZtButton, ZtRate, ZtSwitch, ZtSlider, ZtUpload, ZtSegmented, ZtRadio,
  ZtCheckbox, ZtTransfer, ZtColorPicker,
} from '../src'

const controls = [
  ['input', ZtInput, '.zt-input', '.zt-input__wrapper'],
  ['password', ZtPassword, '.zt-password', '.zt-input__wrapper'],
  ['number', ZtInputNumber, '.zt-input-number', '.zt-input-number'],
  ['otp', ZtInputOtp, '.zt-input-otp', '.zt-input-otp__cell'],
  ['mention', ZtMention, '.zt-mention', 'textarea'],
] as const
const mounted: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = ['input/input', 'input-number/input-number', 'input-otp/input-otp', 'mention/mention', 'autocomplete/status', 'form/form']
    .map(path => compile(`src/components/${path}.scss`).css).join('\n')
    // Happy DOM implements :focus but not :focus-within; mirror its matching ancestors.
    .replaceAll(':focus-within', '.test-focus-within')
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => mounted.splice(0).forEach(wrapper => wrapper.unmount()))
function inForm(component: Component, props = {}, formProps = {}, itemProps = {}) {
  const wrapper = mount(ZtForm, {
    attachTo: document.body,
    props: { underline: true, ...formProps },
    slots: { default: () => h(ZtFormItem, itemProps, () => h(component, props)) },
  })
  mounted.push(wrapper)
  return wrapper
}
async function focusControl(wrapper: VueWrapper) {
  const input = wrapper.get<HTMLInputElement | HTMLTextAreaElement>('input, textarea').element
  input.focus()
  let parent = input.parentElement
  while (parent && parent !== document.body) {
    parent.classList.add('test-focus-within')
    parent = parent.parentElement
  }
  await nextTick()
}
function surfaceStyle(wrapper: VueWrapper, selector: string) {
  return getComputedStyle(wrapper.get(selector).element)
}

describe('Form underline ownership', () => {
  it.each(controls)('marks only the public %s control', (_, component, root) => {
    const wrapper = inForm(component)
    expect(wrapper.get(root).classes()).toContain('is-form-underline')
    expect(wrapper.findAll('.is-form-underline')).toHaveLength(1)
  })

  it.each(controls)('keeps %s outlined outside an underline Form', (_, component) => {
    const wrapper = inForm(component, {}, { underline: false })
    expect(wrapper.find('.is-form-underline').exists()).toBe(false)
    expect('underline' in component.props).toBe(false)
  })

  it('claims a public control boundary even when its Form is outlined', async () => {
    const wrapper = mount(ZtForm, {
      props: { underline: false },
      slots: { default: () => h(ZtInput, null, { suffix: () => h(ZtInput) }) },
    })
    mounted.push(wrapper)
    await wrapper.setProps({ underline: true })
    expect(wrapper.findAll('.is-form-underline')).toHaveLength(1)
    expect(wrapper.findAll('.zt-input')[1]!.classes()).not.toContain('is-form-underline')
  })

  it.each([true, false])('nested Form resets an outer control boundary (outer=%s)', async outer => {
    const innerUnderline = ref(!outer)
    const wrapper = mount(ZtForm, {
      props: { underline: outer },
      slots: { default: () => h(ZtInput, null, {
        suffix: () => h(ZtForm, { underline: innerUnderline.value }, () => h(ZtPassword)),
      }) },
    })
    mounted.push(wrapper)
    expect(wrapper.get('.zt-password').classes().includes('is-form-underline')).toBe(!outer)
    innerUnderline.value = outer
    await nextTick()
    expect(wrapper.get('.zt-password').classes().includes('is-form-underline')).toBe(outer)
  })

  it.each([ZtButton, ZtRate, ZtSwitch, ZtSlider, ZtUpload, ZtSegmented, ZtRadio, ZtCheckbox, ZtTransfer, ZtColorPicker].map(component => [component.name, component] as const))(
    'does not mark excluded %s controls', (_, component) => {
      expect(inForm(component, component === ZtSegmented ? { options: [] } : {}).find('.is-form-underline').exists()).toBe(false)
    },
  )
})

describe('Core underline CSS and preserved behavior', () => {
  it.each(controls)('%s has only a bottom border and an inset focus pixel without resizing', async (_, component, root, surface) => {
    const wrapper = inForm(component, {}, { size: 'large' })
    const before = surfaceStyle(wrapper, surface)
    const geometry = [before.height, before.minHeight, before.paddingTop, before.paddingBottom]
    expect(before.borderTopWidth).toBe('0px')
    expect(before.borderRightWidth).toBe('0px')
    expect(before.borderBottomWidth).toBe('1px')
    expect(before.borderRadius).toBe('0px')
    expect(before.backgroundColor).toBe('transparent')
    await focusControl(wrapper)
    const focused = surfaceStyle(wrapper, surface)
    expect(focused.boxShadow).toContain('inset 0 -1px 0')
    expect(focused.borderBottomWidth).toBe('1px')
    expect([focused.height, focused.minHeight, focused.paddingTop, focused.paddingBottom]).toEqual(geometry)
    expect(wrapper.get(root).classes()).toContain(`${root.slice(1)}--large`)
  })

  it.each(controls)('%s preserves disabled and readonly semantics', async (_, component, _root, surface) => {
    const wrapper = inForm(component, { readonly: true }, { disabled: true })
    expect(wrapper.get('input, textarea').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input, textarea').attributes('readonly')).toBeDefined()
    expect(surfaceStyle(wrapper, surface).borderBottomStyle).toBe('dashed')
    expect(surfaceStyle(wrapper, surface).boxShadow).toBe('none')
  })

  it.each(controls)('%s preserves validation accessibility and error focus color', async (_, component, _root, surface) => {
    const wrapper = inForm(component, {}, {}, { prop: 'value', error: '错误' })
    expect(wrapper.get('input, textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input, textarea').attributes('aria-describedby')).toBeTruthy()
    await focusControl(wrapper)
    expect(surfaceStyle(wrapper, surface).boxShadow).toContain('inset 0 -1px 0')
    expect(surfaceStyle(wrapper, surface).borderBottomColor).toBe('#ef4444')
    expect(wrapper.get('.zt-form-item').classes()).toContain('is-error')
  })

  it('preserves addons, clear action, and an outlined nested helper surface', async () => {
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: { underline: true },
      slots: { default: () => h(ZtInput, { modelValue: 'value', clearable: true }, {
        prepend: () => 'https://', append: () => '.com', suffix: () => h(ZtInput),
      }) },
    })
    mounted.push(wrapper)
    for (const addon of wrapper.findAll('.zt-input__addon')) {
      expect(getComputedStyle(addon.element).borderTopWidth).toBe('0px')
      expect(getComputedStyle(addon.element).borderBottomWidth).toBe('1px')
    }
    expect(wrapper.text()).toContain('https://')
    expect(wrapper.text()).toContain('.com')
    expect(getComputedStyle(wrapper.findAll('.zt-input__wrapper')[1]!.element).borderTopWidth).toBe('1px')
    await wrapper.get('.zt-input__clear').trigger('click')
    expect(wrapper.getComponent(ZtInput).emitted('update:modelValue')).toEqual([['']])
  })

  it('draws a continuous success underline across input addons', async () => {
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: { underline: true },
      slots: { default: () => h(ZtInput, { status: 'success' }, {
        prepend: () => 'https://', append: () => '.com',
      }) },
    })
    mounted.push(wrapper)
    const surfaces = ['.zt-input__prepend', '.zt-input__wrapper', '.zt-input__append']
    for (const selector of surfaces) expect(surfaceStyle(wrapper, selector).borderBottomColor).toBe('#22c55e')
    await focusControl(wrapper)
    for (const selector of surfaces) expect(surfaceStyle(wrapper, selector).boxShadow).toContain('#22c55e')
  })

  it.each([ZtInput, ZtInputNumber])('preserves Form success focus styling for %s', async component => {
    const wrapper = inForm(component, {}, { model: { value: 'ok' } }, { prop: 'value', required: true })
    await wrapper.vm.validate()
    await focusControl(wrapper)
    expect(wrapper.get('.zt-form-item').classes()).toContain('is-success')
    const surface = component === ZtInput ? '.zt-input__wrapper' : '.zt-input-number'
    expect(surfaceStyle(wrapper, surface).borderBottomColor).toBe('#22c55e')
    expect(surfaceStyle(wrapper, surface).boxShadow).toContain('#22c55e')
  })

  it('keeps Mention vertically resizable and OTP cells individually underlined', () => {
    const mention = inForm(ZtMention)
    expect(surfaceStyle(mention, 'textarea').resize).toBe('vertical')
    const otp = inForm(ZtInputOtp, { length: 4, modelValue: '12' })
    expect(otp.findAll('input')).toHaveLength(1)
    expect(otp.findAll('.zt-input-otp__cell')).toHaveLength(4)
    for (const cell of otp.findAll('.zt-input-otp__cell')) {
      expect(getComputedStyle(cell.element).borderTopWidth).toBe('0px')
      expect(cell.attributes('aria-hidden')).toBe('true')
    }
  })

  it('keeps success status on the underline during focus', async () => {
    const wrapper = inForm(ZtInput, { status: 'success' })
    await focusControl(wrapper)
    expect(surfaceStyle(wrapper, '.zt-input__wrapper').borderBottomColor).toBe('#22c55e')
    expect(surfaceStyle(wrapper, '.zt-input__wrapper').boxShadow).toContain('#22c55e')
  })
})
