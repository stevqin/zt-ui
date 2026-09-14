import type { ZtVTableGridRowKey, ZtVTableGridSavePayload } from './types'

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try { return structuredClone(value) } catch { /* Vue reactive proxies need the recursive fallback. */ }
  }
  if (Array.isArray(value)) return value.map(clone) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, clone(item)])) as T
  }
  return value
}

function equal(left: unknown, right: unknown) {
  return Object.is(left, right) || JSON.stringify(left) === JSON.stringify(right)
}

type Draft<Row> = {
  key: ZtVTableGridRowKey
  original: Row
  current: Row
  fields: Set<string>
}

export function createEditStore<Row extends Record<string, unknown>>(getKey: (row: Row) => ZtVTableGridRowKey) {
  const drafts = new Map<ZtVTableGridRowKey, Draft<Row>>()

  function record(row: Row, field: string, oldValue: unknown, value: unknown) {
    const key = getKey(row)
    let draft = drafts.get(key)
    if (!draft) {
      const original = clone(row)
      ;(original as Record<string, unknown>)[field] = clone(oldValue)
      draft = { key, original, current: clone(row), fields: new Set() }
      drafts.set(key, draft)
    } else {
      draft.current = { ...draft.current, ...clone(row) }
    }
    ;(draft.current as Record<string, unknown>)[field] = clone(value)
    if (equal((draft.original as Record<string, unknown>)[field], value)) draft.fields.delete(field)
    else draft.fields.add(field)
    if (draft.fields.size === 0) drafts.delete(key)
  }

  function payload(): ZtVTableGridSavePayload<Row> {
    const changes = Array.from(drafts.values()).map(draft => ({
      key: draft.key,
      row: clone(draft.current),
      original: clone(draft.original),
      fields: Array.from(draft.fields),
    }))
    return {
      rows: changes.map(change => change.row),
      changes,
      changedRowCount: changes.length,
      changedCellCount: changes.reduce((total, change) => total + change.fields.length, 0),
    }
  }

  return {
    record,
    payload,
    apply(rows: Row[]) {
      return rows.map(row => clone(drafts.get(getKey(row))?.current ?? row))
    },
    restoreRows(rows: Row[]) {
      return rows.map(row => clone(drafts.get(getKey(row))?.original ?? row))
    },
    clear: () => drafts.clear(),
  }
}
