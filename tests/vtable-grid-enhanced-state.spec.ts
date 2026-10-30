import { describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { getRecordChanges, rebaseRecordChanges } from '../src/components/vtable-grid/record-changes'
import { buildEnhancedSummary, resolveSummaryMerge } from '../src/components/vtable-grid/summary-layout'
import { createColumnSettingsStore } from '../src/components/vtable-grid/column-settings'

describe('enhanced vtable-grid state', () => {
  it('rebases pending edits, insertions and deletions onto refreshed records', () => {
    const original = [{ id: 1, amount: 10, name: 'A' }, { id: 2, amount: 20, name: 'B' }]
    const drafts = [{ id: 1, amount: 15, name: 'A' }, { id: 3, amount: 30, name: 'C' }]
    const payload = getRecordChanges(drafts, original, row => row.id)
    const refreshed = [{ id: 1, amount: 10, name: 'Fresh' }, original[1], { id: 4, amount: 40, name: 'D' }]
    const rebased = rebaseRecordChanges(refreshed, payload, row => row.id)
    expect(rebased).toEqual([{ id: 1, amount: 15, name: 'Fresh' }, refreshed[2], drafts[1]])
    rebased[0].amount = 99
    expect(refreshed[0].amount).toBe(10)
    expect(payload.rows[0].amount).toBe(15)
  })

  it('tracks inserted, edited and deleted rows with detached reactive snapshots', () => {
    const originals = reactive([{ id: 1, detail: { amount: 1 } }, { id: 2, detail: { amount: 2 } }])
    const rows = reactive([{ id: 1, detail: { amount: 3 } }, { id: 3, detail: { amount: 4 } }])
    const result = getRecordChanges(rows, originals, row => row.id)
    expect(result).toMatchObject({ changedRowCount: 3, changedCellCount: 5, insertedRows: [rows[1]], deletedRows: [originals[1]] })
    expect(result.changes[0].fields).toEqual(['detail'])
    result.records[0].detail.amount = 9
    result.changes[0].original.detail.amount = 8
    expect(rows[0].detail.amount).toBe(3)
    expect(originals[0].detail.amount).toBe(1)
    expect(getRecordChanges([], originals, row => row.id)).toMatchObject({ records: [], rows: [], changedRowCount: 2, changedCellCount: 4 })
  })

  it('compares nested objects independently of property order and detects removed fields', () => {
    expect(getRecordChanges([{ id: 1, nested: { b: 2, a: 1 } }], [{ id: 1, nested: { a: 1, b: 2 }, extra: true }], row => row.id).changes[0].fields).toEqual(['extra'])
  })

  it('keeps backend missing fields blank and supplies enhanced formatter contexts', () => {
    const formatter = vi.fn((value: unknown) => `总:${value}`)
    const rows = [{ name: 'A', amount: 5, count: 2 }]
    const columns = [{ field: 'name' }, { field: 'amount', summary: { summaryField: 'total', formatter } }, { field: 'count', summary: 'sum' as const }]
    const result = buildEnhancedSummary(columns, rows, { backend: { total: 30 }, remote: true })
    expect(result).toMatchObject({ values: { name: '全量合计', amount: '总:30', count: '' }, source: 'backend', scope: 'all' })
    expect(formatter).toHaveBeenCalledWith(30, expect.objectContaining({ field: 'amount', rows, source: 'backend', scope: 'all' }))
  })

  it('preserves legacy array formatter arguments in enhanced summary mode', () => {
    const columns = [{ field: 'amount', summary: { formatter: (value: unknown, rows: { amount: number }[]) => `${value}/${rows.map(row => row.amount).join(',')}` } }]
    expect(buildEnhancedSummary(columns, [{ amount: 3 }, { amount: 4 }]).values.amount).toBe('7/3,4')
  })

  it('calculates frontend scope and excludes empty numeric values', () => {
    const columns = [{ field: 'name' }, { field: 'amount', summary: { type: 'avg' as const } }]
    const result = buildEnhancedSummary(columns, [{ name: 'A', amount: 4 }, { name: 'B', amount: null }], { remote: true })
    expect(result).toMatchObject({ values: { name: '本页合计', amount: 4 }, scope: 'page', source: 'frontend' })
    expect(buildEnhancedSummary(columns, [], { label: { text: context => `${context.rows.length}项`, align: 'right' } }).label).toMatchObject({ text: '0项', align: 'right' })
  })

  it('merges only contiguous visible business fields in the same frozen region', () => {
    const columns = [{ field: 'select', internal: true }, { field: 'a', fixed: 'left' as const }, { field: 'hidden', visible: false }, { field: 'b', fixed: 'left' as const }, { field: 'c' }, { field: 'd', summary: 'sum' as const }]
    expect(resolveSummaryMerge(columns, ['a', 'b'])).toEqual({ fields: ['a', 'b'], startIndex: 1, endIndex: 2 })
    for (const fields of [['a', 'c'], ['a', 'd'], ['hidden'], ['b', 'a'], ['a', 'a'], ['a', 'missing']]) {
      expect(resolveSummaryMerge(columns, fields)).toEqual({ fields: ['a'], startIndex: 1, endIndex: 1 })
    }
    expect(resolveSummaryMerge([{ field: 'd', summary: 'sum' }], [])).toBeNull()
  })

  it('restricts reordering to frozen regions including persisted order', () => {
    const columns = [{ field: 'left', fixed: 'left' as const }, { field: 'a' }, { field: 'b' }, { field: 'right', fixed: 'right' as const }]
    const store = createColumnSettingsStore(columns)
    store.moveTo('a', 2)
    expect(store.value().order).toEqual(['left', 'b', 'a', 'right'])
    store.moveTo('a', 0)
    store.move('right', -2)
    expect(store.value().order).toEqual(['left', 'b', 'a', 'right'])
    const persisted = createColumnSettingsStore(columns, { storageKey: 'grid', storage: { getItem: () => '{"order":["right","b","left","a"],"visible":["b"]}', setItem() {}, removeItem() {} } })
    expect(persisted.value().order).toEqual(['left', 'b', 'a', 'right'])
  })

  it('tolerates malformed and unavailable storage and shows newly added columns by default', () => {
    const columns = [{ field: 'a' }, { field: 'b' }, { field: 'hidden', visible: false }]
    const storage = { getItem: () => '{"order":["a"],"visible":[],"hidden":["a"]}', setItem() { throw Error('unavailable') }, removeItem() { throw Error('unavailable') } }
    const store = createColumnSettingsStore(columns, { storageKey: 'grid', storage })
    expect(store.value().visible).toEqual(['b'])
    expect(() => store.setVisible('a', true)).not.toThrow()
    expect(() => store.reset()).not.toThrow()
    for (const json of ['{"order":{},"visible":false}', '[]', '42']) {
      expect(createColumnSettingsStore(columns, { storageKey: 'grid', storage: { ...storage, getItem: () => json } }).value().visible).toEqual(['a', 'b'])
    }
    expect(createColumnSettingsStore(columns, { storageKey: 'grid', storage: { ...storage, getItem() { throw Error('unavailable') } } }).value().visible).toEqual(['a', 'b'])
  })
})
