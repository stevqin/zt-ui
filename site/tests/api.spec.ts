import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { extractApi } from '../scripts/extract-api.mjs'
const root = resolve(import.meta.dirname, '../..')
const temporary: string[] = []
afterEach(() => temporary.splice(0).forEach(path => rmSync(path, { recursive: true, force: true })))
function fixture() {
  const directory = mkdtempSync(resolve(tmpdir(), 'zt-api-'))
  temporary.push(directory)
  mkdirSync(resolve(directory, 'src/components/sample'), { recursive: true })
  writeFileSync(resolve(directory, 'src/index.ts'), "export { default as ZtSample } from './components/sample/Sample.vue'")
  writeFileSync(resolve(directory, 'src/components/sample/types.ts'), `export interface Base { /** 提示文本 */ label?: string; required: number }; export type Props<T> = Base & { value?: T; mode?: 'a' | 'b' }; export interface Events { (event: 'change', value: string): void }`)
  writeFileSync(resolve(directory, 'src/components/sample/Sample.vue'), `<script setup lang="ts" generic="T extends string">
import type { Props, Events } from './types'
withDefaults(defineProps<Props<T>>(), { mode: 'b' })
defineEmits<Events>()
defineSlots<{cell?: (scope: {value: T}) => unknown}>()
function focus(value: number): boolean { return value > 0 }
defineExpose({focus})
</script><template><slot name="footer" /></template>`)
  return directory
}
describe('source-derived public API', () => {
  it('resolves imported intersections, inherited docs, generic props and actual defaults', () => {
    const component = extractApi(fixture()).sample.components[0]
    expect(component.props).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'label', type: 'string', required: false, description: '提示文本' }),
      expect.objectContaining({ name: 'required', type: 'number', required: true }),
      expect.objectContaining({ name: 'value', type: 'T', required: false }),
      expect.objectContaining({ name: 'mode', type: "'a' | 'b'", defaultValue: "'b'" }),
    ]))
    expect(component.props.find((row: { name: string }) => row.name === 'label')).not.toHaveProperty('defaultValue')
    expect(component.events).toContainEqual(expect.objectContaining({ name: 'change', type: '(value: string) => void' }))
    expect(component.slots).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'cell', type: '(scope: {value: T}) => unknown' }), expect.objectContaining({ name: 'footer' })]))
    expect(component.exposes).toContainEqual(expect.objectContaining({ name: 'focus', type: '(value: number) => boolean' }))
  })
  it('preserves delegated public methods and source documentation over fallback explanations', () => {
    const docs = extractApi(root)
    const password = docs.input.components.find((component: any) => component.name === 'ZtPassword')!
    expect(docs.input.components.find((component: any) => component.name === 'ZtInput')?.exposes.find((row: any) => row.name === 'input')?.type).toBe('HTMLInputElement | undefined')
    expect(password.exposes.find((row: any) => row.name === 'focus')?.type).toMatch(/=> void/)
    expect(docs.button.components[0].props.find((row: any) => row.name === 'disabled')?.description).toContain('禁用')
    expect(docs.backtop.components[0].props.find((row: any) => row.name === 'visibilityHeight')?.description).toContain('滚动超过')
  })
  it('infers real Select option, tag callbacks and selection flags from template scope', () => {
    const slots = extractApi(root).select.components[0].slots
    expect(slots.find(row => row.name === 'option')?.type).toMatch(/"option": ZtSelectOption[;}]/)
    expect(slots.find(row => row.name === 'option')?.type).toContain('"selected": boolean')
    expect(slots.find(row => row.name === 'option')?.type).toContain('"disabled": boolean')
    expect(slots.find(row => row.name === 'tag')?.type).toContain('"option": ZtSelectOption')
    expect(slots.find(row => row.name === 'tag')?.type).toContain('"remove": () => void')
  })
  it('resolves loop destructuring and expressions without mistaking shadowed outer bindings for slot values', () => {
    const directory = fixture()
    writeFileSync(resolve(directory, 'src/components/sample/Sample.vue'), `<script setup lang="ts">
const option: string = 'outside'
const rows: { option: { label: string; value: number }; disabled: boolean }[] = []
const mystery: unknown = []
function selected(item: { value: number }): boolean { return item.value > 0 }
function remove(value: number): void {}
</script><template>
<div v-for="{ option, disabled } in rows"><slot name="option" :option="option" :label="option.label" :selected="selected(option)" :disabled="Boolean(disabled)" :remove="() => remove(option.value)" /></div>
<div v-for="option in mystery"><slot name="unknown" :option="option" /></div>
<slot name="outer" :option="option" />
</template>`)
    const slots = extractApi(directory).sample.components[0].slots
    const option = slots.find(row => row.name === 'option')!.type
    expect(option).toContain('label: string; value: number;')
    expect(option).toContain('"label": string')
    expect(option).toContain('"selected": boolean')
    expect(option).toContain('"disabled": boolean')
    expect(option).toContain('"remove": () => void')
    expect(slots.find(row => row.name === 'unknown')?.type).toContain('"option": unknown')
    expect(slots.find(row => row.name === 'outer')?.type).toContain('"option": string')
  })
  it('extracts spread slot props and finite dynamic slot names, and marks unresolved forwarding unknown', () => {
    const docs = extractApi(root)
    const cell = docs.calendar.components[0].slots.find(row => row.name === 'date-cell')!.type
    expect(cell).toContain('"date": Date')
    expect(cell).toContain('"day": string')
    expect(cell).toContain('"selected": boolean')
    expect(docs.transfer.components[0].slots.map(row => row.name)).toEqual(expect.arrayContaining(['left-footer', 'right-footer']))
    expect(docs['tree-select'].components[0].slots.find(row => row.name === 'default')?.type).toBe('(scope: unknown) => VNode[]')
  })
  it('fails loudly for a public component without a readable props contract', () => {
    const directory = fixture()
    writeFileSync(resolve(directory, 'src/components/sample/Sample.vue'), '<script setup lang="ts">defineProps<MissingProps>()</script><template />')
    expect(() => extractApi(directory)).toThrow(/ZtSample.*MissingProps/)
  })
  it('covers every public family, subcomponents, the JS bridge and separate date pages', () => {
    const docs = extractApi(root)
    const names = Object.values(docs).flatMap((page: any) => page.components.map((component: any) => component.name))
    const inventory = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import { inventory } from ${JSON.stringify(resolve(root, 'scripts/audit-component-contracts.mjs'))}; console.log(JSON.stringify(inventory(${JSON.stringify(root)})))`], { encoding: 'utf8' }))
    for (const entry of inventory) {
      expect(names, `missing public export ${entry.name}`).toContain(entry.kind === 'glyph' ? 'ZtIcon' : entry.name)
    }
    for (const name of ['ZtTableColumn', 'ZtFormGroup', 'ZtVTableGrid', 'ZtVTableGridImportDialog', 'ZtIcon']) expect(names).toContain(name)
    expect(names).not.toContain('ZtAddIcon')
    expect(docs['date-time-picker'].components[0].props.length).toBeGreaterThan(5)
    expect(docs['date-picker-panel'].components[0].name).toBe('ZtDatePickerPanel')
    expect(docs['vtable-grid'].components.find((item: any) => item.name === 'VTableTag')?.types).toContainEqual(expect.objectContaining({ name: 'VTableTagProps' }))
    expect(docs['config-provider'].components[0].types).toContainEqual(expect.objectContaining({ name: 'ZtComponentSize' }))
    expect(docs['vtable-grid'].components.find((item: any) => item.name === 'VTableTag')?.props).toContainEqual(expect.objectContaining({ name: 'text', type: 'string | number' }))
    expect(JSON.parse(readFileSync(resolve(root, 'site/src/generated/api.json'), 'utf8'))).toEqual(docs)
  })
})
