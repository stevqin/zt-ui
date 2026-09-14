import type { ZtVTableGridColumn } from './types'

function safeCell(value: unknown) {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCsv<Row extends object>(columns: ZtVTableGridColumn<Row>[], rows: Row[]) {
  const visible = columns.filter(column => column.visible !== false)
  const header = visible.map(column => safeCell(column.title ?? column.field)).join(',')
  const body = rows.map(row => visible.map(column => safeCell(
    column.copyFormatter ? column.copyFormatter(row) : (row as Record<string, unknown>)[column.field],
  )).join(','))
  return `\uFEFF${[header, ...body].join('\r\n')}`
}
