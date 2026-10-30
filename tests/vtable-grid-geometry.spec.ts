import { describe, expect, it } from 'vitest'
import { fillGridFrozenGap } from '../src/components/vtable-grid/geometry'

describe('right frozen column geometry', () => {
  it('fills only unused center space and keeps explicit fixed widths', () => {
    const columns = [{ field: 'a', width: 100 }, { field: 'b', width: 80, fixed: 'right' }]
    const result = fillGridFrozenGap(columns, 500)
    expect(result.map(column => column.width)).toEqual([100, 320, 80])
    expect(result[1].field).toBe('__zt_grid_spacer__')
    expect(columns).toHaveLength(2)
  })
  it('keeps ordinary overflowing or resizable columns unchanged', () => {
    for (const columns of [[{ field: 'a', width: 300 }, { field: 'b', width: 300, fixed: 'right' }], [{ field: 'a', width: 100, disableColumnResize: false }, { field: 'b', width: 80, fixed: 'right' }], [{ field: 'a', minWidth: 100 }, { field: 'b', width: 80, fixed: 'right' }]]) {
      expect(fillGridFrozenGap(columns, 500)).toEqual(columns)
    }
  })
  it('does not add center gap to a zero-sized table or table without right columns', () => {
    expect(fillGridFrozenGap([{ field: 'a', width: 50 }], 500)).toHaveLength(1)
    expect(fillGridFrozenGap([{ field: 'a', width: 50, fixed: 'right' }], 0)).toHaveLength(1)
  })
})
