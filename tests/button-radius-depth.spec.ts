import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, type Ref } from 'vue'
import { build, loadConfigFromFile } from 'vite'
import { parse } from 'postcss'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtButton, ZtConfigProvider } from '../src'

const wrappers: VueWrapper[] = []
const style = document.createElement('style')
const radii = [[0, 'flat'], [3, 'flat'], [4, 'subtle'], [8, 'subtle'], [9, 'raised'], [16, 'raised']] as const
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const
const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
beforeAll(async () => {
  const resolved = await loadConfigFromFile({ command: 'build', mode: 'production' })
  if (!resolved) throw new Error('Library Vite configuration is missing')
  const { config } = resolved
  const plugins = (config.plugins ?? []).flat().filter(plugin =>
    !plugin || !('name' in plugin) || plugin.name !== 'vite:dts')
  const result = await build({ ...config, configFile: false, plugins, logLevel: 'silent', build: { ...config.build, write: false } })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => 'output' in bundle ? bundle.output : [])
  const css = outputs.find(output => output.type === 'asset' && output.fileName.endsWith('.css'))
  if (!css || css.type !== 'asset') throw new Error('Library CSS was not emitted')
  // Happy DOM cannot activate pointer pseudo-classes. Class substitution retains
  // selector specificity and tests the actual emitted cascade and token resolution.
  style.textContent = String(css.source).replaceAll(':hover', '.test-hover').replaceAll(':active', '.test-active').replaceAll(':focus-visible', '.test-focus-visible')
  // Keep the emitted Button/provider rules, including media/keyframes, for the
  // large matrix. Full-library coexistence is separately covered in feedback-css.
  // PostCSS preserves declarations; Happy DOM's CSSOM reserializes shorthand vars incorrectly.
  const rules = parse(style.textContent)
  rules.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && rule.parent.name.includes('keyframes')) return
    if (!/\.zt-button|\.zt-config-provider|:root/.test(rule.selector)) rule.remove()
  })
  // Happy DOM requires whitespace after @media; minified browser CSS does not.
  style.textContent = rules.toString().replaceAll('@media(', '@media (')
  document.head.append(style)
}, 30_000)
afterAll(() => style.remove())
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  window.happyDOM.settings.device.prefersReducedMotion = 'no-preference'
  const css = style.textContent
  style.remove()
  style.textContent = css
  document.head.append(style)
})
function render(radius: number, size: typeof sizes[number], theme: 'light' | 'dark' = 'light', state: Ref<string> = ref('')) {
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body, props: { borderRadius: radius, size, theme },
    slots: { default: () => statuses.flatMap(status => [false, true].map(circle => h(ZtButton, { status, circle, disabled: state.value === 'disabled', loading: state.value === 'loading' }, () => h('svg')))) },
  })
  normalizeInitialResets(wrapper)
  wrappers.push(wrapper)
  return wrapper
}
function normalizeInitialResets(wrapper: VueWrapper) {
  // Happy DOM treats custom-property `initial` as literal text instead of the
  // guaranteed-invalid value. These isolated light roots have no parent theme,
  // so removing only their initial resets exercises the equivalent fallback.
  if (wrapper.attributes('data-zt-theme') === 'light') {
    const rootStyle = (wrapper.element as HTMLElement).style
    for (const name of Array.from(rootStyle)) {
      if (rootStyle.getPropertyValue(name) === 'initial') rootStyle.removeProperty(name)
    }
  }
}
function depth(button: Element, band: string) {
  const css = getComputedStyle(button)
  expect(css.backgroundColor, 'solid fill').not.toBe('')
  if (band === 'flat') {
    expect(css.backgroundImage).toBe('none')
    expect(css.boxShadow).toBe('none')
  } else if (band === 'subtle') {
    expect(css.backgroundImage).toBe('none')
    expect(css.boxShadow).toMatch(/0 1px 0/)
    expect(css.boxShadow).not.toMatch(/0 [2-9]px/)
  } else {
    expect(css.backgroundImage).toContain('linear-gradient')
    expect(css.boxShadow).toMatch(/0 [2-9]px/)
  }
}
describe.each(['light', 'dark'] as const)('production Button depth (%s)', theme => {
  describe.each(radii)('radius %ipx: %s', (radius, band) => {
    it.each(sizes)('%s: all statuses and shapes preserve depth and feedback', async size => {
      const state = ref('')
      const wrapper = render(radius, size, theme, state)
      const buttons = wrapper.findAllComponents(ZtButton)
      const idleColors = new Map<Element, string>()
      for (const component of buttons) {
        const button = component.element as HTMLButtonElement
        depth(button, band)
        const idle = getComputedStyle(button).backgroundColor
        idleColors.set(button, idle)
        button.classList.add('test-hover')
        depth(button, band)
        const hover = getComputedStyle(button).backgroundColor
        expect(hover, 'hover changes color').not.toBe(idle)
        button.classList.add('test-active')
        expect(getComputedStyle(button).backgroundColor, 'pressed color').not.toBe(hover)
        expect(getComputedStyle(button).transform).toBe(band === 'flat' ? 'none' : band === 'subtle' ? 'scale(.99)' : 'scale(.97)')
        button.classList.add('test-focus-visible')
        expect(getComputedStyle(button).outlineWidth).toBe('2px')
        expect(getComputedStyle(button).outlineStyle).toBe('solid')
      }
      for (const disabledState of ['disabled', 'loading'] as const) {
        state.value = disabledState
        await nextTick()
        normalizeInitialResets(wrapper)
        for (const component of buttons) {
          const button = component.element as HTMLButtonElement
          expect(button.disabled).toBe(true)
          expect(Number(getComputedStyle(button).opacity)).toBe(0.5)
          expect(getComputedStyle(button).backgroundColor).toBe(idleColors.get(button))
          expect(getComputedStyle(button).boxShadow).toBe('none')
          expect(getComputedStyle(button).transform).toBe('none')
          await component.trigger('click')
          expect(component.emitted('click')).toBeUndefined()
          if (disabledState === 'loading') expect(component.find('.zt-button__spinner').exists()).toBe(true)
        }
      }
    })
    it('reduced motion removes button and icon movement while keeping color, focus and loading feedback', async () => {
      window.happyDOM.settings.device.prefersReducedMotion = 'reduce'
      // Reattach to invalidate Happy DOM's cached media query evaluation.
      const css = style.textContent
      style.remove()
      style.textContent = css
      document.head.append(style)
      const state = ref('')
      const wrapper = render(radius, 'default', theme, state)
      for (const button of wrapper.findAll('button')) {
        const idle = getComputedStyle(button.element).backgroundColor
        button.element.classList.add('test-hover', 'test-active', 'test-focus-visible')
        expect(getComputedStyle(button.element).transform).toBe('none')
        expect(getComputedStyle(button.element).backgroundColor).not.toBe(idle)
        expect(getComputedStyle(button.element).outlineWidth).toBe('2px')
        if (button.classes().includes('zt-button--circle')) expect(getComputedStyle(button.get('svg').element).transform).toBe('none')
      }
      state.value = 'loading'
      await nextTick()
      normalizeInitialResets(wrapper)
      for (const spinner of wrapper.findAll('.zt-button__spinner')) {
        expect(getComputedStyle(spinner.element).animation).toBe('none')
        expect(getComputedStyle(spinner.element).borderRightColor).toBe('transparent')
      }
    })
  })
})
it('nested providers override all inherited depth and reactively restore the parent band', async () => {
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body, props: { borderRadius: 0, theme: 'dark' },
    slots: { default: () => [h(ZtButton), h(ZtConfigProvider, { borderRadius: 16 }, () => h(ZtButton)), h(ZtConfigProvider, {}, () => h(ZtButton))] },
  })
  wrappers.push(wrapper)
  const buttons = wrapper.findAll('button')
  depth(buttons[0]!.element, 'flat'); depth(buttons[1]!.element, 'raised'); depth(buttons[2]!.element, 'flat')
  await wrapper.setProps({ borderRadius: 4 })
  depth(buttons[0]!.element, 'subtle'); depth(buttons[1]!.element, 'raised'); depth(buttons[2]!.element, 'subtle')
})
it('nested flat and subtle providers reset a raised ancestor, including circle buttons', () => {
  const wrapper = mount(ZtConfigProvider, {
    attachTo: document.body, props: { borderRadius: 16, theme: 'dark' },
    slots: { default: () => [0, 4].map(borderRadius => h(ZtConfigProvider, { borderRadius }, () => h(ZtButton, { circle: true }))) },
  })
  wrappers.push(wrapper)
  depth(wrapper.findAll('button')[0]!.element, 'flat')
  depth(wrapper.findAll('button')[1]!.element, 'subtle')
})
it('standalone Buttons retain the default raised treatment', () => {
  const wrapper = mount(ZtButton, { attachTo: document.body, props: { status: 'primary' } })
  wrappers.push(wrapper)
  depth(wrapper.element, 'raised')
})
