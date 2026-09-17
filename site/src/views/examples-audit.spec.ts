import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { components } from '../docs/catalog'
import { api } from '../docs/reference'
// @ts-expect-error Node-only audit script is shared with the build gate.
import { inspectExamples } from '../../scripts/audit-examples.mjs'

type Example = { title: string; kind: string; file: string | null }
type Page = { component: string; examples: Example[] }
const audit = inspectExamples() as { pages: Page[]; errors: string[] }
function sourceFor(id: string) {
  return audit.pages
    .find((p) => p.component === id)!
    .examples.filter((e) => e.file)
    .map((e) => readFileSync(resolve(process.cwd(), e.file!), 'utf8'))
    .join('\n')
}

describe('complete and executable documentation examples', () => {
  it('audits every published component, not a handpicked subset', () => {
    expect(audit.pages.map((p) => p.component).sort()).toEqual(
      components.map((c) => c.path.slice(1)).sort(),
    )
    expect(audit.errors).toEqual([])
  })
  it.each(components)('$name renders the exact Vue source exposed for copying', (component) => {
    const page = audit.pages.find((p) => p.component === component.path.slice(1))!
    expect(page.examples.filter((e) => e.kind === 'live').length).toBeGreaterThan(0)
    expect(audit.errors.filter((error) => error.startsWith(page.component + '/'))).toEqual([])
    expect(new Set(page.examples.filter((e) => e.file).map((e) => e.file)).size).toBe(
      page.examples.filter((e) => e.file).length,
    )
  })
  it('contains long source lines without widening the page', () => {
    const styles =
      readFileSync(resolve(process.cwd(), 'src/style.scss'), 'utf8') +
      readFileSync(resolve(process.cwd(), 'src/docs/docs.scss'), 'utf8')
    expect(styles).toMatch(/\.doc-main\s*\{[\s\S]*?min-width:\s*0/)
    expect(styles).toMatch(/\.doc-demo\s*\{[\s\S]*?min-width:\s*0/)
  })
  it('documents the five-level inherited size contract', () => {
    for (const page of [
      'button',
      'tag',
      'radio',
      'checkbox',
      'switch',
      'input',
      'password',
      'input-number',
      'form',
      'badge',
      'steps',
      'pagination',
      'modal',
      'vtable-grid',
    ]) {
      const prop = api[page].components
        .flatMap((owner) => owner.props)
        .find((prop) => prop.name === 'size')!
      const type = api[page].types.find((type) => type.name === prop.type)
      expect(`${prop.type} ${type?.code ?? ''}`).toContain('ZtComponentSize')
      expect(prop.default).toContain('ConfigProvider')
    }
  })
  it('shows all InputNumber controls positions and proper form autofill', () => {
    for (const position of ['default', 'left', 'right'])
      expect(sourceFor('input-number')).toContain(`controls-position="${position}"`)
    expect(sourceFor('form')).toContain('autocomplete="username"')
    expect(sourceFor('form')).toContain('autocomplete="email"')
  })
  it('covers Select behavior with accessible live controls', () => {
    const source = sourceFor('select')
    for (const feature of [
      'multiple',
      'filterable',
      'remote-method',
      '#prefix',
      '#option',
      '#selected',
      '#tag',
      '#empty',
      '#loading',
      '#footer',
      'clearable',
      'mini',
      'small',
      'default',
      'medium',
      'large',
    ])
      expect(source).toContain(feature)
    for (const tag of source.match(/<ZtSelect\b[^>]*>/g) ?? [])
      expect(tag).toMatch(/\saria-(?:label|labelledby)="[^"]+"/)
    expect(source).toContain('option.label')
  })
  it('keeps working table examples complete including simulated query and save', () => {
    const source = sourceFor('vtable-grid')
    for (const feature of [
      'ZtVTableGridColumn',
      'proxyConfig',
      'batchSave',
      'reserve-checkbox',
      'show-actions-column',
      'column-settings',
      'table-options',
      'auto-load',
      'loading',
      'disabled',
      'copyFormatter',
      "editable: 'textarea'",
      "editable: 'date'",
      "type: 'number'",
      "type: 'select'",
      "editable: 'email'",
      "editable: 'url'",
      "summary: 'sum'",
      "summary: 'min'",
      "summary: 'max'",
      'calculate:',
      'formatter:',
      '#form',
      '#toolbar-left',
      '#toolbar-right',
      '#empty',
      '#pager-left',
      '#edit-actions',
      'query(true)',
      'reload()',
      'resize()',
      'setRecords(',
      'getTableInstance()',
      'getSelectedRows',
      'getSelectedKeys',
      'setSelectedKeys',
      'clearSelection',
      'getChanges',
      'exportCsv',
    ])
      expect(source, feature).toContain(feature)
    expect(source).not.toContain("fetch('/api/")
  })
  it('distinguishes the business HTTP integration from executable demos', () => {
    const integration = audit.pages
      .flatMap((page) => page.examples)
      .filter((example) => example.kind === 'integration')
    expect(integration.map((e) => e.title)).toEqual(['接入真实接口'])
    expect(sourceFor('upload')).toContain('async function uploadAttachment')
  })
})
