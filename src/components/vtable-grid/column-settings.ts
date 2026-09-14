import type { ZtVTableGridColumn, ZtVTableGridColumnSettingsValue } from './types'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function createColumnSettingsStore<Row extends Record<string, unknown>>(
  columns: ZtVTableGridColumn<Row>[],
  options: { storageKey?: string; storage?: StorageLike } = {},
) {
  const keys = columns.map(column => column.key ?? column.field)
  const defaultVisible = columns.filter(column => column.visible !== false).map(column => column.key ?? column.field)
  const storage = options.storage ?? (typeof localStorage === 'undefined' ? undefined : localStorage)

  function normalize(input?: Partial<ZtVTableGridColumnSettingsValue> | null): ZtVTableGridColumnSettingsValue {
    const validOrder = (input?.order ?? []).filter(key => keys.includes(key))
    const order = [...new Set([...validOrder, ...keys])]
    const requestedVisible = new Set((input?.visible ?? defaultVisible).filter(key => keys.includes(key)))
    return {
      order,
      visible: order.filter(key => requestedVisible.has(key)),
      hidden: order.filter(key => !requestedVisible.has(key)),
    }
  }

  function read() {
    if (!options.storageKey || !storage) return normalize()
    try { return normalize(JSON.parse(storage.getItem(options.storageKey) || 'null')) } catch { return normalize() }
  }

  let state = read()
  function persist() {
    if (options.storageKey && storage) storage.setItem(options.storageKey, JSON.stringify(state))
  }

  return {
    value: () => ({ ...state, order: [...state.order], visible: [...state.visible], hidden: [...state.hidden] }),
    setVisible(key: string, visible: boolean) {
      const set = new Set(state.visible)
      if (visible) set.add(key)
      else set.delete(key)
      state = normalize({ order: state.order, visible: Array.from(set) })
      persist()
    },
    move(key: string, offset: number) {
      const from = state.order.indexOf(key)
      const to = Math.min(state.order.length - 1, Math.max(0, from + offset))
      if (from < 0 || from === to) return
      const order = [...state.order]
      order.splice(to, 0, ...order.splice(from, 1))
      state = normalize({ order, visible: state.visible })
      persist()
    },
    reset() {
      state = normalize()
      if (options.storageKey && storage) storage.removeItem(options.storageKey)
    },
  }
}
