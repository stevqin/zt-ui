import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sfc } from '../utils/exampleCode'

const pages = ['button', 'tag', 'radio', 'checkbox', 'switch', 'input', 'password', 'input-number', 'select', 'form', 'badge', 'steps', 'pagination', 'vtable-grid']
const selectCodeNames = ['codeBasic', 'codeMultiple', 'codeFilterable', 'codeRemote', 'codeSlots', 'codeDisabled', 'codeSizes']

function selectOpeningTags(source: string) {
  return source.match(/<ZtSelect\b[^>]*>/g) ?? []
}

function selectCodeInitializer(source: string, name: string) {
  const start = source.indexOf(`const ${name} = sfc(`)
  expect(start, `${name} initializer`).toBeGreaterThanOrEqual(0)
  const followingStarts = selectCodeNames
    .map(candidate => source.indexOf(`const ${candidate} = sfc(`, start + 1))
    .filter(index => index >= 0)
  const end = followingStarts.length ? Math.min(...followingStarts) : source.indexOf('\n</script>', start)
  return source.slice(start, end)
}

describe('site example coverage', () => {
  it('contains long code lines without widening the documentation page', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/style.scss'), 'utf8') + readFileSync(resolve(process.cwd(), 'src/docs/docs.scss'), 'utf8')
    expect(styles).toMatch(/\.doc-main\s*\{[\s\S]*?min-width:\s*0/)
    expect(styles).toMatch(/\.doc-demo\s*\{[\s\S]*?min-width:\s*0/)
  })

  it('builds complete Vue and TypeScript SFC source', () => {
    const result = sfc("import { ZtButton } from '@ztechjs/zt-ui'", '<ZtButton>保存</ZtButton>')
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain("import { ZtButton } from '@ztechjs/zt-ui'")
    expect(result).toContain('<template>')
    expect(result).toContain('<ZtButton>保存</ZtButton>')
  })

  it.each(pages)('%s uses DemoBlock with code for every visual demo', page => {
    const source = readFileSync(resolve(process.cwd(), `src/views/${page}/Index.vue`), 'utf8')
    const demoCount = (source.match(/<DemoBlock\b/g) ?? []).length
    const codeCount = (source.match(/<DemoBlock\s+:code=/g) ?? []).length
    expect(source).toContain("import DemoBlock from '@/components/DemoBlock.vue'")
    expect(source).toContain("import { sfc } from '@/utils/exampleCode'")
    expect(source).not.toContain('<div class="doc-demo">')
    expect(demoCount).toBeGreaterThan(0)
    expect(codeCount).toBe(demoCount)
  })

  it('registers the Steps, Pagination, Form and VTableGrid pages in navigation and routing', () => {
    const app = readFileSync(resolve(process.cwd(), 'src/docs/catalog.ts'), 'utf8')
    const router = readFileSync(resolve(process.cwd(), 'src/router/index.ts'), 'utf8')
    expect(app).toContain("path: '/steps'")
    expect(router).toContain("path: '/steps'")
    expect(app).toContain("path: '/pagination'")
    expect(router).toContain("path: '/pagination'")
    expect(app).toContain("path: '/form'")
    expect(router).toContain("path: '/form'")
    expect(app).toContain("path: '/vtable-grid'")
    expect(router).toContain("path: '/vtable-grid'")
  })

  it('documents the shared five-level size contract for every density-aware component', () => {
    const sizePages = ['button', 'tag', 'radio', 'checkbox', 'switch', 'input', 'password', 'input-number', 'form', 'badge', 'steps', 'pagination', 'modal', 'vtable-grid']
    for (const page of sizePages) {
      const source = readFileSync(resolve(process.cwd(), `src/views/${page}/Index.vue`), 'utf8')
      for (const size of ['mini', 'small', 'default', 'medium', 'large']) expect(source, `${page}: ${size}`).toContain(size)
    }
  })

  it('documents every InputNumber controls position', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/input-number/Index.vue'), 'utf8')
    for (const position of ['default', 'left', 'right']) expect(source).toContain(`controls-position="${position}"`)
  })

  it('marks the account form fields for browser autofill', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/form/Index.vue'), 'utf8')
    expect((source.match(/autocomplete="username"/g) ?? [])).toHaveLength(2)
    expect((source.match(/autocomplete="email"/g) ?? [])).toHaveLength(2)
  })

  it('registers Select immediately after InputNumber', () => {
    const app = readFileSync(resolve(process.cwd(), 'src/docs/catalog.ts'), 'utf8')
    const router = readFileSync(resolve(process.cwd(), 'src/router/index.ts'), 'utf8')
    const navPaths = [...app.matchAll(/\{ path: '([^']+)'/g)].map(match => match[1])
    const routePaths = [...router.matchAll(/^\s+path: '([^']+)'/gm)].map(match => match[1])
    expect(navPaths.indexOf('/input-number')).toBeGreaterThanOrEqual(0)
    expect(routePaths.indexOf('/input-number')).toBeGreaterThanOrEqual(0)
    expect(navPaths.indexOf('/select')).toBe(navPaths.indexOf('/input-number') + 1)
    expect(routePaths.indexOf('/select')).toBe(routePaths.indexOf('/input-number') + 1)
  })

  it('documents all Select capabilities in exactly seven complete copyable SFCs', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/select/Index.vue'), 'utf8')
    const template = source.slice(source.indexOf('\n<template>'))
    const demoBindings = [...template.matchAll(/<DemoBlock\s+:code="([^"]+)"/g)].map(match => match[1])
    expect(demoBindings).toEqual(selectCodeNames)
    for (const name of demoBindings) {
      const initializer = selectCodeInitializer(source, name)
      expect(initializer, name).toContain('= sfc(`${baseImports}')
      expect(initializer, name).toContain('ZtSelectOption[]')
      expect(initializer, name).toMatch(/\bref(?:<[^\n]+>)?\(/)
      expect(initializer, name).toMatch(/`,\s*`<ZtSelect/)
      expect(selectOpeningTags(initializer).length, name).toBeGreaterThan(0)
      expect(initializer, name).toMatch(/<\/ZtSelect>|\/>/)
    }

    expect((template.match(/<DemoBlock\b/g) ?? [])).toHaveLength(7)
    for (const capability of [
      'multiple', 'filterable', 'remote-method', '#prefix', '#option', '#selected',
      '#tag', '#empty', '#loading', '#footer', 'clearable',
      'mini', 'small', 'default', 'medium', 'large',
    ]) expect(source, capability).toContain(capability)
  })

  it('gives every live and copyable Select control an accessible name', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/select/Index.vue'), 'utf8')
    const template = source.slice(source.indexOf('\n<template>'))
    const readme = readFileSync(resolve(process.cwd(), '../README.md'), 'utf8')

    const liveTags = selectOpeningTags(template)
    expect(liveTags).toHaveLength(15)
    for (const tag of liveTags) expect(tag).toMatch(/\saria-(?:label|labelledby)="[^"]+"/)

    for (const name of selectCodeNames) {
      const initializer = selectCodeInitializer(source, name)
      for (const tag of selectOpeningTags(initializer)) {
        expect(tag, name).toMatch(/\saria-(?:label|labelledby)="[^"]+"/)
      }
    }

    const liveRemoveButton = template.match(/<button\b[^>]*slot-tag-remove[^>]*>/)?.[0] ?? ''
    const copyRemoveButton = selectCodeInitializer(source, 'codeSlots').match(/<button\b[^>]*@click\.stop="remove"[^>]*>/)?.[0] ?? ''
    for (const button of [liveRemoveButton, copyRemoveButton]) {
      expect(button).toContain(':aria-label=')
      expect(button).toContain('option.label')
    }

    const readmeSelectTags = selectOpeningTags(readme)
    expect(readmeSelectTags).toHaveLength(1)
    expect(readmeSelectTags[0]).toMatch(/\saria-(?:label|labelledby)="[^"]+"/)
  })

  it('provides complete copyable TypeScript VTableGrid capability examples', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/vtable-grid/Index.vue'), 'utf8')
    expect((source.match(/<DemoBlock\s+:code=/g) ?? [])).toHaveLength(7)
    expect((source.match(/\$\{productTypeCode\}/g) ?? [])).toHaveLength(6)
    expect((source.match(/\$\{productRecordCode\}/g) ?? [])).toHaveLength(4)
    expect(source).toContain('const sourceRows: Product[]')
    expect(source).toContain('async function proxyConfig(params: ZtVTableGridQueryParams)')
    for (const capability of [
      'ZtVTableGridColumn', 'proxyConfig', 'batchSave', 'reserve-checkbox', 'show-actions-column',
      'column-settings', 'table-options', 'auto-load', 'loading', 'disabled', 'copyFormatter',
      "editable: 'textarea'", "editable: 'date'", "type: 'number'", "type: 'select'", "editable: 'email'", "editable: 'url'",
      "summary: 'sum'", "summary: 'min'", "summary: 'max'", 'calculate:', 'formatter:',
      '#form', '#toolbar-left', '#toolbar-right', '#empty', '#pager-left', '#edit-actions',
      'query(true)', 'reload()', 'resize()', 'setRecords(', 'getTableInstance()', 'getSelectedRows',
      'getSelectedKeys', 'setSelectedKeys', 'clearSelection', 'getChanges', 'saveChanges', 'cancelChanges', 'exportCsv',
    ]) expect(source, capability).toContain(capability)
  })
})
