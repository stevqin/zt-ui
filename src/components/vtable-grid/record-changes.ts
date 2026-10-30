import type { ZtVTableGridSavePayload } from './types'

export interface RecordChanges<Row> extends ZtVTableGridSavePayload<Row> {
  records: Row[]
  insertedRows: Row[]
  deletedRows: Row[]
}

export function cloneGridData<T>(value: T): T {
  return clone(value)
}

function clone<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (!value || typeof value !== 'object') return value
  if (seen.has(value)) return seen.get(value) as T
  if (value instanceof Date) return new Date(value.getTime()) as T
  const result = (Array.isArray(value) ? [] : {}) as Record<string, unknown>
  seen.set(value, result)
  for (const key of Object.keys(value)) {
    Object.defineProperty(result, key, { value: clone((value as Record<string, unknown>)[key], seen), writable: true, enumerable: true, configurable: true })
  }
  return result as T
}

function equal(left: unknown, right: unknown, seen = new WeakMap<object, object>()): boolean {
  if (Object.is(left, right)) return true
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false
  if (left instanceof Date || right instanceof Date) return left instanceof Date && right instanceof Date && left.getTime() === right.getTime()
  if (Array.isArray(left) !== Array.isArray(right)) return false
  if (seen.has(left)) return seen.get(left) === right
  seen.set(left, right)
  const keys = Object.keys(left)
  return keys.length === Object.keys(right).length && keys.every(key => Object.prototype.hasOwnProperty.call(right, key)
    && equal((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key], seen))
}

export function getRecordChanges<Row extends object>(
  records: Row[], originalRecords: Row[], getKey: (row: Row) => string | number,
): RecordChanges<Row> {
  const originalByKey = new Map(originalRecords.map(row => [getKey(row), row]))
  const currentKeys = new Set(records.map(getKey))
  const insertedRows: Row[] = []
  const changes: RecordChanges<Row>['changes'] = []
  for (const row of records) {
    const key = getKey(row)
    const original = originalByKey.get(key)
    if (!original) { insertedRows.push(clone(row)); continue }
    const fields = [...new Set([...Object.keys(original), ...Object.keys(row)])].filter(field =>
      !equal((row as Record<string, unknown>)[field], (original as Record<string, unknown>)[field]))
    if (fields.length) changes.push({ key, row: clone(row), original: clone(original), fields })
  }
  const deletedRows = originalRecords.filter(row => !currentKeys.has(getKey(row))).map(row => clone(row))
  return {
    records: clone(records), rows: [...changes.map(change => change.row), ...insertedRows], changes, insertedRows, deletedRows,
    changedRowCount: changes.length + insertedRows.length + deletedRows.length,
    changedCellCount: changes.reduce((count, change) => count + change.fields.length, 0)
      + [...insertedRows, ...deletedRows].reduce((count, row) => count + Object.keys(row).length, 0),
  }
}

/** Apply unsaved fields to a refreshed source without replacing untouched fields. */
export function rebaseRecordChanges<Row extends object>(
  records: Row[], payload: ZtVTableGridSavePayload<Row>, getKey: (row: Row) => string | number,
): Row[] {
  const snapshot = payload as Partial<RecordChanges<Row>>
  const deleted = new Set((snapshot.deletedRows ?? []).map(getKey))
  const changes = new Map(payload.changes.map(change => [change.key, change]))
  const result = records.filter(row => !deleted.has(getKey(row))).map(row => {
    const change = changes.get(getKey(row))
    const merged = cloneGridData(row) as Record<string, unknown>
    for (const field of change?.fields ?? []) {
      if (Object.prototype.hasOwnProperty.call(change!.row, field)) merged[field] = cloneGridData((change!.row as Record<string, unknown>)[field])
      else delete merged[field]
    }
    return merged as Row
  })
  const keys = new Set(result.map(getKey))
  for (const row of [...payload.changes.map(change => change.row), ...(snapshot.insertedRows ?? [])]) {
    if (!keys.has(getKey(row))) { result.push(cloneGridData(row)); keys.add(getKey(row)) }
  }
  return result
}
