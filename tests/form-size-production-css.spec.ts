import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, type Component } from 'vue'
import { build, loadConfigFromFile } from 'vite'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  ZtConfigProvider, ZtDrawer, ZtForm, ZtFormItem, ZtInput, ZtPassword,
  ZtInputNumber, ZtInputOtp, ZtMention,
} from '../src'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(async () => {
  const resolved = await loadConfigFromFile({ command: 'build', mode: 'production' })
  if (!resolved) throw new Error('Library Vite configuration is missing')
  const { config } = resolved
  const plugins = (config.plugins ?? []).flat().filter(plugin =>
    !plugin || !('name' in plugin) || plugin.name !== 'vite:dts')
  const result = await build({
    ...config, configFile: false, plugins, logLevel: 'silent',
    build: { ...config.build, write: false },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => 'output' in bundle ? bundle.output : [])
  const css = outputs.find(output => output.type === 'asset' && output.fileName.endsWith('.css'))
  if (!css || css.type !== 'asset') throw new Error('Library CSS was not emitted')
  // Happy DOM lacks pointer hover and :focus-within. Preserve specificity while
  // applying these states to the native target and every matching ancestor.
  style.textContent = String(css.source).replaceAll(':hover', '.test-hover').replaceAll(':focus-within', '.test-focus-within')
  document.head.append(style)
}, 30_000)
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  resetOverlayManager()
  document.body.innerHTML = ''
})

function markAncestors(target: Element, className: string) {
  let element: Element | null = target
  while (element && element !== document.body) {
    element.classList.add(className)
    element = element.parentElement
  }
}
const controls = [
  ['Input', ZtInput, '.zt-input__wrapper'],
  ['Password', ZtPassword, '.zt-input__wrapper'],
  ['InputNumber', ZtInputNumber, '.zt-input-number'],
  ['Mention', ZtMention, 'textarea'],
  ['InputOtp', ZtInputOtp, '.zt-input-otp__cell'],
] as const
async function formControl(component: Component, state: 'error' | 'success' | 'neutral', underline = true, disabled = false, compound = false) {
  const wrapper = mount(ZtForm, {
    attachTo: document.body,
    props: { underline, disabled, model: { value: 'ok' } },
    slots: { default: () => h(ZtFormItem, {
      prop: 'value', required: true, ...(state === 'error' ? { error: '错误' } : {}),
    }, () => h(component, {}, compound ? { prepend: () => 'https://', append: () => '.com' } : {})) },
  })
  wrappers.push(wrapper)
  if (state === 'success') await wrapper.vm.validate()
  return wrapper
}

describe('production CSS: Form semantic underlines', () => {
  describe.each([['error', '#ef4444'], ['success', '#22c55e']] as const)('%s', (state, color) => {
    it.each(controls)('%s keeps semantic idle, nested-hover and focus pixels', async (_, component, surface) => {
      const wrapper = await formControl(component, state)
      const input = wrapper.get<HTMLInputElement | HTMLTextAreaElement>('input, textarea').element
      const target = wrapper.get(surface).element
      expect(getComputedStyle(target).borderBottomColor, 'idle line').toBe(color)
      markAncestors(input, 'test-hover')
      expect(getComputedStyle(target).borderBottomColor, 'native target hovered').toBe(color)
      input.focus()
      markAncestors(input, 'test-focus-within')
      await nextTick()
      expect(getComputedStyle(target).borderBottomColor, 'focused line').toBe(color)
      expect(getComputedStyle(target).boxShadow, 'focused inset pixel').toContain(`inset 0 -1px 0 ${color}`)
      expect(getComputedStyle(target).borderBottomWidth).toBe('1px')
    })

    it('keeps compound Input addon lines continuous through hover and focus', async () => {
      const wrapper = await formControl(ZtInput, state, true, false, true)
      const input = wrapper.get<HTMLInputElement>('input').element
      const surfaces = wrapper.findAll('.zt-input__wrapper, .zt-input__addon')
      for (const surface of surfaces) expect(getComputedStyle(surface.element).borderBottomColor, 'idle line').toBe(color)
      markAncestors(input, 'test-hover')
      for (const surface of surfaces) expect(getComputedStyle(surface.element).borderBottomColor, 'hovered line').toBe(color)
      input.focus()
      markAncestors(input, 'test-focus-within')
      await nextTick()
      for (const surface of surfaces) {
        expect(getComputedStyle(surface.element).borderBottomColor).toBe(color)
        expect(getComputedStyle(surface.element).boxShadow).toContain(`inset 0 -1px 0 ${color}`)
      }
    })

    it.each(controls)('%s keeps validation disabled surfaces dashed without a focus shadow', async (_, component, surface) => {
      const wrapper = await formControl(component, state, true, true)
      markAncestors(wrapper.get('input, textarea').element, 'test-hover')
      expect(getComputedStyle(wrapper.get(surface).element).borderBottomStyle).toBe('dashed')
      expect(getComputedStyle(wrapper.get(surface).element).boxShadow).toBe('none')
    })
  })

  it.each(controls)('%s preserves ordinary outlined surfaces', async (_, component, surface) => {
    const wrapper = await formControl(component, 'neutral', false)
    expect(getComputedStyle(wrapper.get(surface).element).borderTopWidth).toBe('1px')
    expect(getComputedStyle(wrapper.get(surface).element).borderRadius).not.toBe('0px')
  })

  it.each(controls.slice(0, 3))('%s preserves neutral hover and theme focus', async (_, component, surface) => {
    const wrapper = await formControl(component, 'neutral')
    const input = wrapper.get<HTMLInputElement>('input').element
    const target = wrapper.get(surface).element
    markAncestors(input, 'test-hover')
    expect(getComputedStyle(target).borderBottomColor).toBe('#bfd2ff')
    input.focus()
    markAncestors(input, 'test-focus-within')
    await nextTick()
    expect(getComputedStyle(target).borderBottomColor).toBe('#245edb')
    expect(getComputedStyle(target).boxShadow).toContain('inset 0 -1px 0 #245edb')
  })
})

const densities = [
  ['mini', '14px'], ['small', '17px'], ['default', '22px'], ['medium', '25px'], ['large', '28px'],
] as const
describe('production CSS: Drawer density body padding', () => {
  it.each(densities)('inherits %s density body padding', (size, padding) => {
    const wrapper = mount(ZtConfigProvider, {
      attachTo: document.body, props: { size },
      slots: { default: () => h(ZtDrawer, { modelValue: true, autoFocus: false }) },
    })
    wrappers.push(wrapper)
    const body = document.querySelector<HTMLElement>('.zt-drawer-surface__body')!
    expect(body.style.padding).toBe('')
    expect(getComputedStyle(body).padding).toBe(padding)
  })

  it('updates body padding when inherited or explicit density changes', async () => {
    const explicitSize = ref<'small' | 'medium'>()
    const wrapper = mount(ZtConfigProvider, {
      attachTo: document.body, props: { size: 'mini' },
      slots: { default: () => h(ZtDrawer, { modelValue: true, autoFocus: false, size: explicitSize.value }) },
    })
    wrappers.push(wrapper)
    const body = document.querySelector<HTMLElement>('.zt-drawer-surface__body')!
    expect(getComputedStyle(body).padding).toBe('14px')
    await wrapper.setProps({ size: 'large' })
    expect(getComputedStyle(body).padding).toBe('28px')
    explicitSize.value = 'small'
    await nextTick()
    expect(getComputedStyle(body).padding).toBe('17px')
    explicitSize.value = 'medium'
    await nextTick()
    expect(getComputedStyle(body).padding).toBe('25px')
  })

  it.each([0, 9, '12px 18px'])('respects explicit bodyPadding=%s across densities and restores CSS on removal', async bodyPadding => {
    const wrapper = mount(ZtDrawer, {
      attachTo: document.body, props: { modelValue: true, autoFocus: false, size: 'mini', bodyPadding },
    })
    wrappers.push(wrapper)
    const body = document.querySelector<HTMLElement>('.zt-drawer-surface__body')!
    const expected = typeof bodyPadding === 'number' ? `${bodyPadding}px` : bodyPadding
    expect(getComputedStyle(body).padding).toBe(expected)
    await wrapper.setProps({ size: 'large' })
    expect(getComputedStyle(body).padding).toBe(expected)
    await wrapper.setProps({ bodyPadding: undefined })
    expect(body.style.padding).toBe('')
    expect(getComputedStyle(body).padding).toBe('28px')
  })
})
