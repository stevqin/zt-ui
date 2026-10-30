export interface GridFilterColumn {
  field: string
  filter?: unknown
}
export interface GridFilterStore<Row> {
  set: (field: string, values: unknown[]) => void
  clear: (field?: string) => void
  values: (field: string, rows: Row[]) => unknown[]
  apply: (rows: Row[]) => Row[]
  active: (field: string) => boolean
}

/** Enumerations and filters apply to the supplied loaded records only. */
export function createGridFilterStore<Row extends object>(columns: GridFilterColumn[]): GridFilterStore<Row> {
  const eligible = new Set(columns.filter(column => column.filter === true).map(column => column.field))
  const filters = new Map<string, unknown[]>()
  const read = (row: Row, field: string) => (row as Record<string, unknown>)[field]
  return {
    set(field, values) {
      if (!eligible.has(field)) return
      if (!values.length) filters.delete(field)
      else filters.set(field, [...values])
    },
    clear(field) {
      if (field === undefined) filters.clear()
      else filters.delete(field)
    },
    values(field, rows) {
      if (!eligible.has(field)) return []
      const values: unknown[] = []
      rows.forEach(row => { const value = read(row, field); if (!values.some(item => Object.is(item, value))) values.push(value) })
      return values
    },
    apply(rows) {
      return rows.filter(row => [...filters].every(([field, values]) => values.some(value => Object.is(value, read(row, field)))))
    },
    active: field => filters.has(field),
  }
}
