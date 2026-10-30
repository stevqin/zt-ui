import { mount } from '@vue/test-utils'
import { parse } from '@vue/compiler-sfc'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { extractApi } from '../scripts/extract-api.mjs'
import ApiReference from '../src/components/ApiReference.vue'
import type { ApiRow } from '../src/app/types'
const root = resolve(import.meta.dirname, '../..')

describe('SKU input copyable contracts', () => {
  it('extracts documented business fields from source without expanding every supporting type', () => {
    const directory = mkdtempSync(resolve(tmpdir(), 'zt-sku-docs-'))
    try {
      mkdirSync(resolve(directory, 'src/components/sample'), { recursive: true })
      writeFileSync(resolve(directory, 'src/index.ts'), "export { default as ZtSample } from './components/sample/Sample.vue'")
      writeFileSync(resolve(directory, 'src/components/sample/index.ts'), "export type * from './types'")
      const quantitySource = ts.createSourceFile('quantities.ts', readFileSync(resolve(root, 'src/components/sku-input/types.ts'), 'utf8'), ts.ScriptTarget.Latest, true)
      const quantity = quantitySource.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'ZtSkuQuantityValue')!
      writeFileSync(resolve(directory, 'src/components/sample/types.ts'), readFileSync(resolve(root, 'src/components/sku-select/types.ts'), 'utf8') + '\n' + quantity.getFullText(quantitySource))
      writeFileSync(resolve(directory, 'src/components/sample/Sample.vue'), '<script setup lang="ts">defineProps<{ product: unknown }>()</script><template />')
      const types = extractApi(directory).sample!.components[0]!.types!
      const fields = (name: string) => types.find(row => row.name === name)?.fields
      expect(fields('ZtSkuProduct')).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'product_no', required: false }),
        expect.objectContaining({ name: 'spu', required: false }),
        expect.objectContaining({ name: 'skcs', type: 'ZtSkuColor[]', required: true, description: expect.stringContaining('SKC') }),
      ]))
      expect(types.find(row => row.name === 'ZtSkuProduct')?.description).toContain('至少提供一项')
      expect(fields('ZtSkuColor')).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'image_url', required: false, description: expect.stringContaining('图片') }),
        expect.objectContaining({ name: 'disabled', description: expect.stringContaining('整个颜色') }),
        expect.objectContaining({ name: 'skus', type: 'ZtSkuOption[]', required: true }),
      ]))
      expect(fields('ZtSkuOption')).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'sku', required: true }),
        expect.objectContaining({ name: 'size_name', required: false, description: expect.stringContaining('size_code') }),
        expect.objectContaining({ name: 'disabled', description: expect.stringContaining('禁用') }),
      ]))
      expect(fields('ZtSkuQuantityValue')).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'sku', type: 'string', required: true, description: expect.stringContaining('SKU') }),
        expect.objectContaining({ name: 'quantity', type: 'number', required: true, description: expect.stringContaining('正整数') }),
      ]))
      expect(types.find(row => row.name === 'ZtSkuSelectProps')).not.toHaveProperty('fields')
    } finally { rmSync(directory, { recursive: true, force: true }) }
  })
  it('renders data structures independently without nested tables and retains events and slots', () => {
    const types: ApiRow[] = [{ name: 'ZtSkuProduct', type: 'type ZtSkuProduct = { skcs: ZtSkuColor[] }', description: '商品代码使用 product_no 或 spu，至少提供一项。', fields: [{ name: 'skcs', type: 'ZtSkuColor[]', required: true, description: '当前商品的 SKC 列表。' }] }]
    const wrapper = mount(ApiReference, { props: { components: [{ name: 'ZtSkuInput', props: [], exposes: [], types, events: [{ name: 'change', type: '(value: ZtSkuInputChange) => void' }], slots: [{ name: 'summary', type: '(scope: { totalQuantity: number }) => VNode[]' }] }] } })
    const table = wrapper.find('table[aria-label="ZtSkuProduct 字段"]')
    expect(table.exists()).toBe(true)
    expect(wrapper.find('table table').exists()).toBe(false)
    expect(wrapper.find('#api-ZtSkuInput-data-structures h5').text()).toBe('ZtSkuProduct')
    expect(wrapper.find('#api-ZtSkuInput-types').exists()).toBe(false)
    expect(table.find('tbody tr').text()).toContain('skcs')
    expect(table.text()).toContain('必填')
    expect(table.text()).toContain('当前商品的 SKC 列表。')
    expect(table.find('details').exists()).toBe(false)
    expect(wrapper.find('#api-ZtSkuInput-events').text()).toContain('change')
    expect(wrapper.find('#api-ZtSkuInput-slots').text()).toContain('summary')
    wrapper.unmount()
  })
  it.each(['Basic', 'Array', 'Constraints', 'Keyboard', 'Shared'])('%s exposes actual SPU, SKC and SKU objects without relative imports', (name) => {
    const source = readFileSync(resolve(root, `site/src/examples/sku-input/${name}.vue`), 'utf8')
    const script = parse(source).descriptor.scriptSetup!.content
    const ast = ts.createSourceFile('example.ts', script, ts.ScriptTarget.Latest, true)
    for (const node of ast.statements) if (ts.isImportDeclaration(node)) expect((node.moduleSpecifier as ts.StringLiteral).text).not.toMatch(/^\./)
    const product = ast.statements.flatMap(node => ts.isVariableStatement(node) ? [...node.declarationList.declarations] : []).find(node => node.name.getText(ast) === (name === 'Constraints' ? 'constrained' : 'product'))!
    expect(product).toBeDefined()
    expect(ts.isObjectLiteralExpression(product.initializer!)).toBe(true)
    const object = product.initializer as ts.ObjectLiteralExpression
    const property = (node: ts.ObjectLiteralExpression, key: string) => node.properties.find(item => ts.isPropertyAssignment(item) && item.name.getText(ast) === key) as ts.PropertyAssignment
    expect(property(object, 'product_no').initializer.getText(ast)).toBe("'TEE-2601'")
    expect(property(object, 'product_name').initializer.getText(ast)).toBe("'基础棉质短袖'")
    const colors = property(object, 'skcs').initializer as ts.ArrayLiteralExpression
    expect(ts.isArrayLiteralExpression(colors)).toBe(true)
    for (const color of colors.elements as unknown as ts.ObjectLiteralExpression[]) {
      for (const field of ['skc', 'color_code', 'color_name', 'image_url', 'skus']) expect(property(color, field), field).toBeDefined()
      const skus = property(color, 'skus').initializer as ts.ArrayLiteralExpression
      expect(ts.isArrayLiteralExpression(skus)).toBe(true)
      for (const sku of skus.elements as unknown as ts.ObjectLiteralExpression[]) {
        expect(property(sku, 'sku')).toBeDefined()
        expect(property(sku, 'size_code')).toBeDefined()
      }
    }
    expect(source).toContain("sku: 'TEE-023-S'")
    expect(source).not.toMatch(/<ZtSkuInput[^>]*\ssize=/)
  })
})
