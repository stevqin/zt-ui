import type { ZtSkuProduct } from '../sku-select/types'
import type { ZtSkuInputChange, ZtSkuQuantities, ZtSkuInputValue, ZtSkuInputValueType } from './types'

export function buildSkuMatrix(product: ZtSkuProduct, order: string[] = []) {
  const names = new Map<string, string>()
  for (const color of product.skcs) for (const sku of color.skus) {
    if (sku.sku.trim() && sku.size_code.trim() && !names.has(sku.size_code)) names.set(sku.size_code, sku.size_name || sku.size_code)
  }
  const codes = [...new Set([...order.filter(code => names.has(code)), ...names.keys()])]
  return {
    columns: codes.map(code => ({ code, name: names.get(code)! })),
    rows: product.skcs.map(source => ({ source, cells: codes.map(code => {
      const sku = source.skus.find(item => item.size_code === code && item.sku.trim())
      return sku ? { source: sku, disabled: Boolean(source.disabled || sku.disabled) } : null
    }) })),
  }
}
export function quantityLimit(max: number) {
  return Number.isFinite(max) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(max))) : 999999
}
export function parseQuantity(raw: string, max: number): number | null {
  const text = raw.trim()
  if (!text) return 0
  if (!/^\d+$/.test(text)) return null
  return Math.min(max, Number(text))
}
export function quantityMap(value: ZtSkuInputValue): ZtSkuQuantities {
  if (!Array.isArray(value)) return value
  return Object.fromEntries(value.filter(item => item && typeof item.sku === 'string').map(item => [item.sku, item.quantity]))
}
export function currentQuantities(matrix: ReturnType<typeof buildSkuMatrix>, input: ZtSkuInputValue, max: number) {
  const values = quantityMap(input)
  const valid: ZtSkuQuantities = {}
  for (const row of matrix.rows) for (const cell of row.cells) {
    if (!cell) continue
    const quantity = values[cell.source.sku]
    if (Number.isSafeInteger(quantity) && quantity > 0 && max > 0) valid[cell.source.sku] = Math.min(quantity, max)
  }
  return valid
}
export function quantityResult<T extends ZtSkuInputValueType = 'object'>(product: ZtSkuProduct, matrix: ReturnType<typeof buildSkuMatrix>, values: ZtSkuQuantities, valueType?: T): ZtSkuInputChange<T> {
  const entries = matrix.rows.flatMap(row => row.cells.flatMap(cell => cell && values[cell.source.sku] > 0 ? [{ spu: product, skc: row.source, sku: cell.source, quantity: values[cell.source.sku]! }] : []))
  const output = (valueType === 'array' ? entries.map(item => ({ sku: item.sku.sku, quantity: item.quantity })) : values) as ZtSkuInputValue<T>
  return { values: output, entries, totalQuantity: entries.reduce((total, item) => total + item.quantity, 0), skuCount: entries.length }
}
