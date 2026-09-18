import { flushPromises, mount } from '@vue/test-utils'
import * as Vue from 'vue'
import { build, loadConfigFromFile } from 'vite'
import type { OutputChunk, RollupOutput } from 'rollup'
import { beforeAll, expect, it, vi } from 'vitest'

let esm: OutputChunk
let umd: OutputChunk
let consumer: { ZtSelectBox: Vue.Component; ZtMessage: typeof import('@ztechjs/zt-alert')['ZtMessage'] }
function chunks(result: RollupOutput | RollupOutput[]) {
  return (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output)
    .filter((output): output is OutputChunk => output.type === 'chunk')
}
async function libraryBuild(mode: string) {
  const loaded = await loadConfigFromFile({ command: 'build', mode })
  if (!loaded) throw new Error('Library Vite configuration is missing')
  const { config } = loaded
  const plugins = (config.plugins ?? []).flat().filter(plugin => !plugin || !('name' in plugin) || plugin.name !== 'vite:dts')
  return chunks(await build({ ...config, configFile: false, plugins, logLevel: 'silent', build: { ...config.build, write: false } }) as RollupOutput[])
}

beforeAll(async () => {
  const outputs = await libraryBuild('production')
  esm = outputs.find(output => output.fileName === 'zt-ui.js')!
  umd = (await libraryBuild('umd')).find(output => output.fileName === 'zt-ui.umd.cjs')!
  if (!esm || !umd) throw new Error('Expected ESM and UMD library artifacts')
  // A real consumer build imports the emitted library and zt-alert independently.
  // Evaluate its IIFE with the test's Vue instance so mounting uses one Vue runtime.
  const result = await build({
    configFile: false, logLevel: 'silent',
    plugins: [{
      name: 'feedback-consumer-fixture',
      resolveId(id) {
        if (id.endsWith('virtual:consumer')) return '\0virtual:consumer'
        if (id === 'virtual:dist-zt-ui') return '\0virtual:dist-zt-ui'
      },
      load(id) {
        if (id === '\0virtual:dist-zt-ui') return esm.code
        if (id === '\0virtual:consumer') return "export { ZtSelectBox } from 'virtual:dist-zt-ui'; export { ZtMessage } from '@ztechjs/zt-alert';"
      },
    }],
    build: {
      write: false, lib: { entry: 'virtual:consumer', name: 'ZtConsumer', formats: ['iife'] },
      rollupOptions: {
        external: ['vue', '@visactor/vtable', '@visactor/vtable-editors', '@visactor/vue-vtable'],
        treeshake: { moduleSideEffects: id => !id.startsWith('@visactor/') },
        output: { globals: { vue: 'Vue' } },
      },
    },
  })
  const code = chunks(result as RollupOutput[])[0]!.code
  consumer = new Function('Vue', `${code}\nreturn ZtConsumer;`)(Vue)
}, 30_000)

it('shares one message stack between built SelectBox and the consumer direct zt-alert import', async () => {
  vi.useFakeTimers()
  const wrapper = mount(consumer.ZtSelectBox, { attachTo: document.body, props: { options: [{ value: 'a', label: 'Alpha' }] } })
  try {
    consumer.ZtMessage.info({ content: 'Consumer message', duration: 0 })
    await wrapper.get('.zt-select-box__trigger').trigger('click')
    await flushPromises()
    document.querySelector<HTMLElement>('.zt-select-box-panel__mode')!.click(); await flushPromises()
    const textarea = document.querySelector<HTMLTextAreaElement>('textarea')!
    textarea.value = 'Alpha'; textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    document.querySelector<HTMLElement>('.zt-select-box-panel__confirm')!.click(); await flushPromises()
    expect(document.querySelectorAll('.zt-notice')).toHaveLength(2)
    expect(document.querySelectorAll('.zt-message-stack')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a']]])
  } finally {
    wrapper.unmount()
    document.querySelectorAll<HTMLElement>('.zt-notice').forEach(notice => { notice.style.transitionDuration = '0s' })
    consumer.ZtMessage.clear()
    await vi.runAllTimersAsync()
    document.body.innerHTML = ''
    vi.useRealTimers()
  }
})

it('externalizes zt-alert in ESM while keeping the UMD feedback runtime self-contained', () => {
  expect(esm.imports).toContain('@ztechjs/zt-alert')
  expect(umd.imports).not.toContain('@ztechjs/zt-alert')
  expect(umd.code.includes('zt-notice__content')).toBe(true)
})
