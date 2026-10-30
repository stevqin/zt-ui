import type { ZtVTableGridColumn, ZtVTableGridColumnSettingsValue } from './types'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function createColumnSettingsStore<Row extends object>(
  columns: ZtVTableGridColumn<Row>[],
  options: { storageKey?: string; storage?: StorageLike } = {},
) {
  const keys = columns.map(column => column.key ?? column.field)
  const defaultVisible = columns.filter(column => column.visible !== false).map(column => column.key ?? column.field)
  const region = (key: string) => columns.find(column => (column.key ?? column.field) === key)?.fixed ?? 'center'
  let storage: StorageLike | undefined
  try { storage = options.storage ?? (typeof localStorage === 'undefined' ? undefined : localStorage) } catch { /* Storage may be blocked by the browser. */ }

  function normalize(input?: Partial<ZtVTableGridColumnSettingsValue> | null): ZtVTableGridColumnSettingsValue {
    const validArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(key => typeof key === 'string')
    const validOrder = validArray(input?.order) ? input.order.filter(key => keys.includes(key)) : []
    const requestedOrder = [...new Set([...validOrder, ...keys])]
    const order = ['left', 'center', 'right'].flatMap(group => requestedOrder.filter(key => region(key) === group))
    const persistedVisible = validArray(input?.visible) ? input.visible : defaultVisible
    const known = new Set(validOrder)
    if (validArray(input?.visible)) input.visible.forEach(key => known.add(key))
    if (validArray(input?.hidden)) input.hidden.forEach(key => known.add(key))
    const requestedVisible = new Set(persistedVisible.filter(key => keys.includes(key)))
    defaultVisible.filter(key => !known.has(key)).forEach(key => requestedVisible.add(key))
    return { order, visible: order.filter(key => requestedVisible.has(key)), hidden: order.filter(key => !requestedVisible.has(key)) }
  }

  function read() {
    if (!options.storageKey || !storage) return normalize()
    try { return normalize(JSON.parse(storage.getItem(options.storageKey) || 'null')) } catch { return normalize() }
  }

  let state = read()
  function persist() {
    try { if (options.storageKey && storage) storage.setItem(options.storageKey, JSON.stringify(state)) } catch { /* Keep in-memory settings usable when storage is unavailable. */ }
  }
  function moveTo(key: string, index: number) {
    const from = state.order.indexOf(key)
    if (from < 0 || !Number.isFinite(index)) return
    const to = Math.min(state.order.length - 1, Math.max(0, Math.trunc(index)))
    if (from === to || region(key) !== region(state.order[to])) return
    const order = [...state.order]
    order.splice(to, 0, ...order.splice(from, 1))
    state = normalize({ order, visible: state.visible })
    persist()
  }
  const value = () => ({ ...state, order: [...state.order], visible: [...state.visible], hidden: [...state.hidden] })
  return {
    value,
    get: value,
    setVisible(key: string, visible: boolean) {
      if (!keys.includes(key)) return
      const set = new Set(state.visible)
      if (visible) set.add(key)
      else set.delete(key)
      state = normalize({ order: state.order, visible: Array.from(set) })
      persist()
    },
    move(key: string, offset: number) { moveTo(key, state.order.indexOf(key) + offset) },
    moveTo,
    reset() {
      state = normalize()
      try { if (options.storageKey && storage) storage.removeItem(options.storageKey) } catch { /* Reset still applies to in-memory settings. */ }
    },
  }
}
