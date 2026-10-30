import { describe, expect, it } from 'vitest'
import { createGridFilterStore } from '../src/components/vtable-grid/filter'

describe('grid loaded-record filters', () => {
  const rows = [{ value: 1, private: 'a' }, { value: '1', private: 'b' }, { value: null, private: 'c' }, { value: '', private: 'd' }, { value: undefined, private: 'e' }]
  it('filters only explicitly eligible columns without converting typed values', () => {
    const store = createGridFilterStore([{ field: 'value', filter: true }, { field: 'private' }])
    store.set('private', ['a'])
    expect(store.apply(rows)).toEqual(rows)
    store.set('value', [1])
    expect(store.active('value')).toBe(true)
    expect(store.apply(rows)).toEqual([rows[0]])
    store.set('value', [null, ''])
    expect(store.apply(rows)).toEqual([rows[2], rows[3]])
    store.clear('value')
    expect(store.active('value')).toBe(false)
    expect(store.apply(rows)).toEqual(rows)
  })
  it('enumerates distinct raw values from supplied loaded rows and clears empty selections', () => {
    const store = createGridFilterStore([{ field: 'value', filter: true }])
    expect(store.values('value', [...rows, rows[0]])).toEqual([1, '1', null, '', undefined])
    expect(store.values('private', rows)).toEqual([])
    store.set('value', [1]); store.set('value', [])
    expect(store.active('value')).toBe(false)
    expect(store.apply([])).toEqual([])
    store.set('value', ['1']); store.clear()
    expect(store.apply(rows)).toEqual(rows)
  })
})
