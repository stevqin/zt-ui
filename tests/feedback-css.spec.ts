import { readFileSync } from 'node:fs'
import { h } from 'vue'
import ZtButton from '../src/components/button/ZtButton.vue'
import ZtConfigProvider from '../src/components/config-provider/ZtConfigProvider.vue'
import { mount } from '@vue/test-utils'
import { compile } from 'sass'
import { build, loadConfigFromFile } from 'vite'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import ZtIcon from '../src/components/icon/ZtIcon.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'

const alertCss = readFileSync('node_modules/@ztechjs/zt-alert/dist/style.css', 'utf8')
const sourceCss = ['drawer/drawer', 'icon/icon', 'button/button', 'config-provider/config-provider']
  .map(path => compile(`src/components/${path}.scss`).css).join('\n')
let builtCss = ''

beforeAll(async () => {
  // Exercise the production CSS pipeline without writing build artifacts from tests.
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
  const stylesheet = outputs.find(output => output.type === 'asset' && output.fileName.endsWith('.css'))
  if (!stylesheet || stylesheet.type !== 'asset') throw new Error('Library CSS was not emitted')
  builtCss = String(stylesheet.source)
}, 30_000)

const wrappers: ReturnType<typeof mount>[] = []
const styles: HTMLStyleElement[] = []
function applyStyles(production: boolean, alertLast: boolean) {
  const localCss = production ? builtCss : sourceCss
  const style = document.createElement('style')
  style.textContent = (alertLast ? [localCss, alertCss] : [alertCss, localCss]).join('\n')
  document.head.append(style)
  styles.push(style)
}

function resolveLength(value: string, computed: CSSStyleDeclaration): string {
  // Happy DOM leaves nested token references in computed lengths unresolved.
  const variable = value.match(/^var\((--[\w-]+)(?:,\s*(.+))?\)$/)
  return variable
    ? resolveLength(computed.getPropertyValue(variable[1]!).trim() || variable[2] || '', computed)
    : value
}

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  styles.splice(0).forEach(style => style.remove())
  resetOverlayManager()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe.each([false, true])('feedback CSS coexistence (production build=%s)', production => {
  describe.each([false, true])('zt-alert loaded last=%s', alertLast => {
    it('preserves flat Buttons when external feedback styles load in either order', () => {
      applyStyles(production, alertLast)
      const wrapper = mount(ZtConfigProvider, {
        attachTo: document.body, props: { borderRadius: 0 },
        slots: { default: () => h(ZtButton, { status: 'primary' }, () => '确认') },
      })
      wrappers.push(wrapper)
      const css = getComputedStyle(wrapper.get('button').element)
      expect(css.backgroundImage).toBe('none')
      expect(css.boxShadow).toBe('none')
      expect(css.backgroundColor).not.toBe('')
    })

    it.each([
      { placement: 'right' as const, transform: /translate(?:X)?\(100%\)/ },
      { placement: 'left' as const, transform: /translate(?:X)?\(-100%\)/ },
      { placement: 'top' as const, transform: /translateY\(-100%\)/ },
      { placement: 'bottom' as const, transform: /translateY\(100%\)/ },
    ])('keeps the $placement Drawer visible when open and hides it after closing', async ({ placement, transform }) => {
      applyStyles(production, alertLast)
      vi.useFakeTimers()
      const wrapper = mount(ZtDrawer, {
        attachTo: document.body,
        props: { modelValue: true, placement, autoFocus: false },
        global: { stubs: { transition: false } },
      })
      wrappers.push(wrapper)
      const panel = document.querySelector<HTMLElement>('[role="dialog"]')!
      const root = panel.parentElement!
      expect(getComputedStyle(panel).transform).toMatch(transform)
      await vi.runAllTimersAsync()
      expect(getComputedStyle(panel).transform).toMatch(/^(?:none)?$/)
      expect(getComputedStyle(root).display).not.toBe('none')
      await wrapper.setProps({ modelValue: false })
      await vi.runAllTimersAsync()
      expect(getComputedStyle(root).display).toBe('none')
      await wrapper.setProps({ modelValue: true })
      await vi.runAllTimersAsync()
      expect(getComputedStyle(panel).transform).toMatch(/^(?:none)?$/)
      expect(getComputedStyle(root).display).not.toBe('none')
    })

    it.each([
      { label: 'undefined', size: undefined, expected: '1em', resolved: '16px' },
      { label: '28', size: 28, expected: '28px', resolved: '28px' },
      { label: '1.5em', size: '1.5em', expected: '1.5em', resolved: '24px' },
      { label: '50%', size: '50%', expected: '50%', resolved: '50%' },
    ])('resolves Icon size $label as $expected', ({ size, expected, resolved }) => {
      applyStyles(production, alertLast)
      const wrapper = mount(ZtIcon, { attachTo: document.body, props: { name: 'search', size } })
      wrappers.push(wrapper)
      const computed = getComputedStyle(wrapper.element)
      expect(computed.getPropertyValue('--zt-icon-size').trim()).toBe(expected)
      expect(resolveLength(computed.width, computed)).toBe(resolved)
      expect(resolveLength(computed.height, computed)).toBe(resolved)
    })
  })
})
