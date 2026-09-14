import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sfc } from '../utils/exampleCode'

const pages = ['button', 'tag', 'radio', 'checkbox', 'switch', 'badge', 'steps', 'pagination', 'vtable-grid']

describe('site example coverage', () => {
  it('contains long code lines without widening the documentation page', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/style.scss'), 'utf8')
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

  it('registers the Steps, Pagination and VTableGrid pages in navigation and routing', () => {
    const app = readFileSync(resolve(process.cwd(), 'src/App.vue'), 'utf8')
    const router = readFileSync(resolve(process.cwd(), 'src/router/index.ts'), 'utf8')
    expect(app).toContain("path: '/steps'")
    expect(router).toContain("path: '/steps'")
    expect(app).toContain("path: '/pagination'")
    expect(router).toContain("path: '/pagination'")
    expect(app).toContain("path: '/vtable-grid'")
    expect(router).toContain("path: '/vtable-grid'")
  })

  it('documents the shared five-level size contract for every density-aware component', () => {
    const sizePages = ['button', 'tag', 'radio', 'checkbox', 'switch', 'badge', 'steps', 'pagination', 'modal', 'vtable-grid']
    for (const page of sizePages) {
      const source = readFileSync(resolve(process.cwd(), `src/views/${page}/Index.vue`), 'utf8')
      for (const size of ['mini', 'small', 'default', 'medium', 'large']) expect(source, `${page}: ${size}`).toContain(size)
    }
  })

  it('provides complete copyable TypeScript VTableGrid capability examples', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/views/vtable-grid/Index.vue'), 'utf8')
    expect((source.match(/<DemoBlock\s+:code=/g) ?? [])).toHaveLength(7)
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
