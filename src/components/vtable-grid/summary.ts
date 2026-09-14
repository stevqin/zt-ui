import type { ZtVTableGridColumn, ZtVTableGridSummaryRule, ZtVTableGridSummaryType } from './types'

function standard(type: ZtVTableGridSummaryType, values: unknown[]) {
  const present = values.filter(value => value !== null && value !== undefined && value !== '')
  const numbers = present.map(Number).filter(Number.isFinite)
  if (type === 'count') return present.length
  if (numbers.length === 0) return 0
  if (type === 'avg') return numbers.reduce((sum, value) => sum + value, 0) / numbers.length
  if (type === 'min') return Math.min(...numbers)
  if (type === 'max') return Math.max(...numbers)
  return numbers.reduce((sum, value) => sum + value, 0)
}

export function buildSummaryValues<Row extends Record<string, unknown>>(
  columns: ZtVTableGridColumn<Row>[],
  rows: Row[],
  backend: Record<string, unknown> | null = null,
) {
  return Object.fromEntries(columns.flatMap(column => {
    if (!column.summary) return []
    const rule: ZtVTableGridSummaryRule<Row> = typeof column.summary === 'string'
      ? { type: column.summary }
      : column.summary
    const values = rows.map(row => row[column.field])
    const raw = backend && column.field in backend
      ? backend[column.field]
      : rule.calculate ? rule.calculate(values, rows) : standard(rule.type ?? 'sum', values)
    return [[column.field, rule.formatter ? rule.formatter(raw, rows) : raw]]
  }))
}
