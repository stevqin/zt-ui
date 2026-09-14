import { describe, expect, it, vi } from 'vitest'
import { buildVTableColumns, resolveActionButtons, resolveRowKey } from '../src/components/vtable-grid/columns'
import { editorName, registerGridEditors } from '../src/components/vtable-grid/editors'
import type { ZtVTableGridColumn } from '../src/components/vtable-grid/types'

type Row = { id: number; name: string; amount: number; state: string }
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'name', title: '名称', sort: true },
  { field: 'amount', title: '金额', fixed: 'right', editable: 'number' },
  { field: 'state', title: '状态', fixed: 'left', visible: false },
]

describe('vtable-grid column adapter', () => {
  it('orders visible fixed columns and inserts internal columns once', () => {
    const result = buildVTableColumns(columns, {
      settings: { order: ['amount', 'state', 'name'], visible: ['state', 'name', 'amount'], hidden: [] },
      checkbox: true,
      showActionsColumn: true,
      actionsWidth: 180,
    }) as Array<Record<string, unknown>>

    expect(result.map(column => column.field)).toEqual(['__zt_grid_checked__', 'state', 'name', 'amount', '__zt_grid_actions__'])
    expect(result.filter(column => column.field === '__zt_grid_checked__')).toHaveLength(1)
    expect(result.find(column => column.field === 'name')?.sort).toBe(true)
    expect(result.find(column => column.field === 'amount')?.editor).toBe('zt-vtable-number')
  })

  it('resolves standard and row-specific action buttons', () => {
    const row: Row = { id: 1, name: 'A', amount: 2, state: 'enabled' }
    const actions = resolveActionButtons<Row>(current => [
      'detail',
      { type: 'disable', visible: current.state === 'enabled' },
      { type: 'delete', disabled: current.amount > 1 },
    ], row)
    expect(actions.map(action => action.text)).toEqual(['查看', '停用', '删除'])
    expect(actions[2].disabled).toBe(true)
  })

  it('resolves row keys from a field or callback', () => {
    const row: Row = { id: 7, name: 'A', amount: 2, state: 'enabled' }
    expect(resolveRowKey(row, 'id')).toBe(7)
    expect(resolveRowKey(row, item => `row-${item.id}`)).toBe('row-7')
  })

  it('registers stable editor names idempotently', () => {
    const register = vi.fn()
    registerGridEditors(register)
    registerGridEditors(register)
    expect(register).toHaveBeenCalledTimes(6)
    expect(editorName('number')).toBe('zt-vtable-number')
    expect(editorName({ type: 'select', options: ['A', 'B'] })).toBe('zt-vtable-select-A|B')
  })
})
