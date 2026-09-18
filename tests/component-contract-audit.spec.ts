import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const root = process.cwd()
const temporary: string[] = []
afterEach(() => temporary.splice(0).forEach(path => rmSync(path, { recursive: true, force: true })))
function audit(directory = root) {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/audit-component-contracts.mjs'), '--root', directory], { encoding: 'utf8' })
  return { status: result.status, output: result.stdout + result.stderr }
}
function fixture() {
  const directory = mkdtempSync(join(tmpdir(), 'zt-contract-audit-'))
  temporary.push(directory)
  for (const item of ['src', 'docs/ui-api-consistency-audit.md', 'site/src/docs/api.generated.json', 'tests']) {
    cpSync(resolve(root, item), join(directory, item), { recursive: true })
  }
  return directory
}
function replace(directory: string, file: string, from: string | RegExp, to: string) {
  const path = join(directory, file)
  const original = readFileSync(path, 'utf8')
  const updated = original.replace(from, to)
  expect(updated, 'the mutation must actually change the fixture').not.toBe(original)
  writeFileSync(path, updated)
}

describe('whole-library component contract gate', () => {
  it('audits every public component and exits successfully only when all contracts are covered', () => {
    const result = audit()
    expect(result.output).toMatch(/public components/)
    expect(result.status, result.output).toBe(0)
  })
  it('rejects a missing matrix row, including a raw SVG icon export', () => {
    const directory = fixture()
    replace(directory, 'docs/ui-api-consistency-audit.md', /^\| ZtAddIcon .*\n/m, '')
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtAddIcon: missing matrix row')
  })
  it('discovers a new public component through the entry-point re-export graph', () => {
    const directory = fixture()
    const index = join(directory, 'src/index.ts')
    writeFileSync(index, readFileSync(index, 'utf8') + "\nexport { default as ZtNewControl } from './components/button/ZtButton.vue'\n")
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtNewControl: missing matrix row')
  })
  it.each([
    'export default Control',
    'const Alias = Control; export default Alias',
    'export default Alias; const Alias = Control',
  ])('discovers a public component through a default-export barrel: %s', declaration => {
    const directory = fixture()
    const barrel = join(directory, 'src/components/button/default-barrel.ts')
    writeFileSync(barrel, `import Control from './ZtButton.vue'; ${declaration}\n`)
    const index = join(directory, 'src/index.ts')
    writeFileSync(index, readFileSync(index, 'utf8') + "\nexport { default as ZtNewControl } from './components/button/default-barrel'\n")
    const result = audit(directory)
    expect(result.status, result.output).toBe(1)
    expect(result.output).toContain('ZtNewControl: missing matrix row')
  })
  it.each([
    ['indeterminate?: boolean', 'indeterminate: string'],
    ['indeterminate?: boolean', 'indeterminate: boolean'],
    ['indeterminate?: boolean', 'indeterminate?: string'],
  ])('rejects component-specific public prop drift: %s -> %s', (before, after) => {
    const directory = fixture()
    replace(directory, 'src/components/checkbox/types.ts', before, after)
    const result = audit(directory)
    expect(result.status, result.output).toBe(1)
    expect(result.output).toContain('ZtCheckbox: metadata type mismatch for indeterminate')
  })
  it('rejects generated metadata that loses an existing public prop', () => {
    const directory = fixture()
    const file = join(directory, 'site/src/docs/api.generated.json')
    const metadata = JSON.parse(readFileSync(file, 'utf8'))
    metadata.button.components[0].props = metadata.button.components[0].props.filter((prop: { name: string }) => prop.name !== 'disabled')
    writeFileSync(file, JSON.stringify(metadata))
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtButton: metadata missing prop disabled')
  })
  it('rejects incorrect generated common-prop types and component-only status aliases', () => {
    const directory = fixture()
    const file = join(directory, 'site/src/docs/api.generated.json')
    const metadata = JSON.parse(readFileSync(file, 'utf8'))
    metadata.button.components[0].props.find((prop: { name: string }) => prop.name === 'disabled').type = 'number'
    writeFileSync(file, JSON.stringify(metadata))
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtButton: metadata type mismatch for disabled')
  })
  it('rejects an invalid dimension disposition instead of accepting arbitrary waiver text', () => {
    const directory = fixture()
    replace(directory, 'docs/ui-api-consistency-audit.md', '| ZtAddIcon | compliant | intrinsic |', '| ZtAddIcon | compliant | skipped |')
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtAddIcon: invalid density contract skipped')
  })
  it('rejects unknown density vocabulary without conflating numeric Icon dimensions', () => {
    const directory = fixture()
    replace(directory, 'src/components/types.ts', "'mini' |", "'compact' |")
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('density vocabulary')
  })
  it('keeps visual danger and validation error in their own families', () => {
    const directory = fixture()
    replace(directory, 'src/components/button/types.ts', "'danger'", "'error'")
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtButton: visual status vocabulary')
  })
  it('rejects lost density inheritance and reduced-motion support', () => {
    const directory = fixture()
    replace(directory, 'src/components/button/ZtButton.vue', 'const configSize = useZtSize(props)', "const configSize = computed(() => props.size ?? 'default')")
    replace(directory, 'src/components/collapse/collapse.scss', /prefers-reduced-motion/g, 'prefers-irrelevant-motion')
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('ZtButton: density inheritance')
    expect(result.output).toContain('ZtCollapse: reduced-motion')
  })
  it('rejects newly published compatibility guidance anywhere in public component sources', () => {
    const directory = fixture()
    const file = join(directory, 'src/components/button/types.ts')
    writeFileSync(file, readFileSync(file, 'utf8') + '\n/** @deprecated Use another prop. */\n')
    const result = audit(directory)
    expect(result.status).toBe(1)
    expect(result.output).toContain('compatibility guidance')
  })
})
