import { describe, expect, it } from 'vitest'
import { createSelectionStore } from '../src/components/vtable-grid/selection'
import { createEditStore } from '../src/components/vtable-grid/editing'
import { buildSummaryValues } from '../src/components/vtable-grid/summary'
import { createColumnSettingsStore } from '../src/components/vtable-grid/column-settings'
import { toCsv } from '../src/components/vtable-grid/csv'
import type { ZtVTableGridColumn } from '../src/components/vtable-grid/types'

type Row = { id: number; name: string; amount: number; group?: string }
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'name', title: '名称' },
  { field: 'amount', title: '金额', summary: 'sum' },
  { field: 'group', title: '分组', visible: false },
]

describe('vtable-grid state helpers', () => {
  it('reserves keyed selections across page changes', () => {
    const store = createSelectionStore<Row>(row => row.id)
    const firstPage = [{ id: 1, name: 'A', amount: 1 }, { id: 2, name: 'B', amount: 2 }]
    store.replacePage(firstPage, true)
    store.toggle(firstPage[0], true)
    store.replacePage([{ id: 3, name: 'C', amount: 3 }], true)
    expect(store.keys()).toEqual([1])
    expect(store.rows()[0].name).toBe('A')

    store.replacePage([{ id: 4, name: 'D', amount: 4 }], false)
    expect(store.rows()).toEqual([])
  })

  it('tracks changed fields and removes changes restored to the original value', () => {
    const row: Row = { id: 1, name: 'A', amount: 10 }
    const store = createEditStore<Row>(item => item.id)
    store.record(row, 'amount', 10, 20)
    expect(store.payload()).toMatchObject({ changedRowCount: 1, changedCellCount: 1, rows: [{ id: 1, name: 'A', amount: 20 }] })

    store.record({ ...row, amount: 20 }, 'name', 'A', 'B')
    expect(store.payload().changes[0].fields).toEqual(['amount', 'name'])

    store.record({ ...row, amount: 20, name: 'B' }, 'amount', 20, 10)
    expect(store.payload().changes[0].fields).toEqual(['name'])
    expect(store.restoreRows([{ ...row, amount: 20, name: 'B' }])).toEqual([row])
  })

  it('rebases edited fields onto freshly queried rows', () => {
    const store = createEditStore<Row>(item => item.id)
    store.record({ id: 1, name: '旧名称', amount: 10 }, 'amount', 10, 20)

    expect(store.apply([{ id: 1, name: '服务端新名称', amount: 15 }])).toEqual([
      { id: 1, name: '服务端新名称', amount: 20 },
    ])
    expect(store.restoreRows([{ id: 1, name: '服务端新名称', amount: 20 }])).toEqual([
      { id: 1, name: '服务端新名称', amount: 15 },
    ])
  })

  it('calculates standard summaries and applies custom formatters', () => {
    const summaryColumns: ZtVTableGridColumn<Row>[] = [
      { field: 'amount', title: '金额', summary: 'sum' },
      { field: 'id', title: '平均', summary: { type: 'avg', formatter: value => `≈${value}` } },
      { field: 'name', title: '数量', summary: 'count' },
    ]
    const rows = [{ id: 1, name: 'A', amount: 10 }, { id: 3, name: 'B', amount: 20 }]
    expect(buildSummaryValues(summaryColumns, rows)).toEqual({ amount: 30, id: '≈2', name: 2 })
    expect(buildSummaryValues(summaryColumns, rows, { amount: 99 })).toMatchObject({ amount: 99 })
  })

  it('restores valid column settings and appends new columns', () => {
    const memory = new Map<string, string>()
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
      removeItem: (key: string) => memory.delete(key),
    }
    memory.set('grid', JSON.stringify({ order: ['amount', 'missing', 'name'], visible: ['amount'], hidden: ['name'] }))
    const store = createColumnSettingsStore(columns, { storageKey: 'grid', storage })
    expect(store.value()).toEqual({ order: ['amount', 'name', 'group'], visible: ['amount'], hidden: ['name', 'group'] })
    store.move('group', -1)
    store.setVisible('name', true)
    expect(store.value()).toEqual({ order: ['amount', 'group', 'name'], visible: ['amount', 'name'], hidden: ['group'] })
    expect(JSON.parse(memory.get('grid')!)).toEqual(store.value())
    store.reset()
    expect(store.value().order).toEqual(['name', 'amount', 'group'])
  })

  it('creates safe UTF-8 CSV with escaped cells', () => {
    const csv = toCsv(columns, [{ id: 1, name: '=SUM(A1:A2), "quoted"\nnext', amount: 12 }])
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain('名称,金额')
    expect(csv).toContain('"\'=SUM(A1:A2), ""quoted""\nnext",12')
    expect(csv).not.toContain('分组')
  })
})
