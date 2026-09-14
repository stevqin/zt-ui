import type { ZtVTableGridRowKey } from './types'

export function createSelectionStore<Row>(getKey: (row: Row) => ZtVTableGridRowKey) {
  const selected = new Map<ZtVTableGridRowKey, Row>()
  const known = new Map<ZtVTableGridRowKey, Row>()

  return {
    replacePage(rows: Row[], reserve: boolean) {
      if (!reserve) {
        selected.clear()
        known.clear()
      }
      rows.forEach(row => {
        const key = getKey(row)
        known.set(key, row)
        if (selected.has(key)) selected.set(key, row)
      })
    },
    toggle(row: Row, checked: boolean) {
      const key = getKey(row)
      known.set(key, row)
      if (checked) selected.set(key, row)
      else selected.delete(key)
    },
    selectPage(rows: Row[], checked: boolean) {
      rows.forEach(row => {
        const key = getKey(row)
        known.set(key, row)
        if (checked) selected.set(key, row)
        else selected.delete(key)
      })
    },
    setKeys(keys: ZtVTableGridRowKey[]) {
      selected.clear()
      keys.forEach(key => {
        const row = known.get(key)
        if (row) selected.set(key, row)
      })
    },
    keys: () => Array.from(selected.keys()),
    rows: () => Array.from(selected.values()),
    has: (row: Row) => selected.has(getKey(row)),
    clear: () => selected.clear(),
  }
}
