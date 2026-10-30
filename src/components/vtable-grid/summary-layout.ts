import type { ZtVTableGridSummaryType } from './types'

export interface EnhancedSummaryContext<Row> {
  rows: Row[]
  source: 'frontend' | 'backend'
  scope: 'all' | 'page'
}
export type EnhancedSummaryFormatterContext<Row> = Row[] & EnhancedSummaryContext<Row> & { field: string }
export interface EnhancedSummaryLabel<Row> {
  text?: string | ((context: EnhancedSummaryContext<Row>) => string)
  fields?: string[]
  align?: 'left' | 'center' | 'right'
}
export interface EnhancedSummaryColumn<Row> {
  field: string
  visible?: boolean
  fixed?: 'left' | 'right'
  internal?: boolean
  summary?: ZtVTableGridSummaryType | {
    type?: ZtVTableGridSummaryType
    summaryField?: string
    calculate?: (values: unknown[], rows: Row[]) => unknown
    formatter?: (value: unknown, context: EnhancedSummaryFormatterContext<Row>) => unknown
  }
}
export interface EnhancedSummaryOptions<Row> {
  backend?: Record<string, unknown> | null
  remote?: boolean
  scope?: 'all' | 'page'
  label?: string | EnhancedSummaryLabel<Row>
  style?: unknown
}

export function resolveSummaryMerge<Row>(columns: EnhancedSummaryColumn<Row>[], labelFields: string[] = []) {
  const visible = columns.filter(column => column.visible !== false)
  const eligible = (column: EnhancedSummaryColumn<Row>) => !column.summary && !column.internal && !column.field.startsWith('__zt_')
  const fallback = visible.findIndex(eligible)
  const indexes = labelFields.map(field => visible.findIndex(column => column.field === field && eligible(column)))
  const valid = indexes.length > 0 && indexes.every((index, position) => index >= 0
    && (position === 0 || index === indexes[position - 1] + 1)
    && visible[index].fixed === visible[indexes[0]].fixed)
  const resolved = valid ? indexes : fallback >= 0 ? [fallback] : []
  if (!resolved.length) return null
  return { fields: resolved.map(index => visible[index].field), startIndex: resolved[0], endIndex: resolved[resolved.length - 1] }
}

function aggregate(type: ZtVTableGridSummaryType, values: unknown[]) {
  const present = values.filter(value => value !== undefined && value !== null && value !== '')
  if (type === 'count') return present.length
  const numbers = present.map(Number).filter(Number.isFinite)
  if (!numbers.length) return 0
  if (type === 'min') return Math.min(...numbers)
  if (type === 'max') return Math.max(...numbers)
  const sum = numbers.reduce((total, value) => total + value, 0)
  return type === 'avg' ? sum / numbers.length : sum
}

export function buildEnhancedSummary<Row extends object>(
  columns: EnhancedSummaryColumn<Row>[], rows: Row[], options: EnhancedSummaryOptions<Row> = {},
) {
  const source = options.backend && typeof options.backend === 'object' && !Array.isArray(options.backend) ? 'backend' : 'frontend'
  const scope = source === 'backend' ? 'all' : options.scope ?? (options.remote ? 'page' : 'all')
  const context: EnhancedSummaryContext<Row> = { rows, source, scope }
  const config = typeof options.label === 'string' ? { text: options.label } : options.label ?? {}
  const merge = resolveSummaryMerge(columns, config.fields)
  const text = typeof config.text === 'function' ? config.text(context)
    : config.text ?? (source === 'backend' ? '全量合计' : scope === 'page' ? '本页合计' : '合计')
  const label = { text, fields: merge?.fields ?? [], align: config.align ?? 'left', style: options.style }
  const values: Record<string, unknown> = {}
  if (label.fields.length) values[label.fields[0]] = text
  for (const column of columns) {
    if (!column.summary || column.visible === false || column.internal) continue
    const rule = typeof column.summary === 'string' ? { type: column.summary } : column.summary
    const field = rule.summaryField ?? column.field
    if (source === 'backend' && !Object.prototype.hasOwnProperty.call(options.backend, field)) {
      values[column.field] = ''
      continue
    }
    const fieldValues = rows.map(row => (row as Record<string, unknown>)[column.field])
    const value = source === 'backend' ? options.backend![field]
      : rule.calculate ? rule.calculate(fieldValues, rows) : aggregate(rule.type ?? 'sum', fieldValues)
    const formatterContext = Object.assign([...rows], { field: column.field, ...context })
    values[column.field] = rule.formatter ? rule.formatter(value, formatterContext) : value
  }
  return { values, source, scope, label }
}
