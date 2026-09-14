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
    expect((result.find(column => column.field === 'amount')?.editor as Function)({
      col: 1, row: 1, table: { getCellOriginRecord: () => ({ id: 1 }) },
    })).toBe('zt-vtable-number')
  })

  it('drives checkbox state and disables summary row interaction', () => {
    const result = buildVTableColumns(columns, {
      settings: { order: ['name', 'amount', 'state'], visible: ['name', 'amount'], hidden: ['state'] },
      checkbox: true,
      showActionsColumn: false,
      editable: true,
      isRowSelected: row => row.id === 1,
    }) as Array<Record<string, any>>
    const checkbox = result[0]
    const amount = result.find(column => column.field === 'amount')!
    const normalArgs = { col: 0, row: 1, table: { getCellOriginRecord: () => ({ id: 1 }) } }
    const summaryArgs = { col: 0, row: 2, table: { getCellOriginRecord: () => ({ __zt_grid_summary__: true }) } }

    expect(checkbox.checked(normalArgs)).toBe(true)
    expect(checkbox.disable(summaryArgs)).toBe(true)
    expect(amount.editor(summaryArgs)).toBeUndefined()
    expect(amount.editor(normalArgs)).toBe('zt-vtable-number')
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

  it('preserves select labels and values and applies number constraints', () => {
    const register = vi.fn()
    registerGridEditors(register)

    const numberName = editorName({ type: 'number', min: 1, max: 9, step: 2 })
    const numberEditor = register.mock.calls.find(call => call[0] === numberName)?.[1]
    numberEditor.container = document.createElement('div')
    numberEditor.createElement()
    expect(numberEditor.element.min).toBe('1')
    expect(numberEditor.element.max).toBe('9')
    expect(numberEditor.element.step).toBe('2')

    const selectName = editorName({ type: 'select', options: [{ label: '启用', value: 1 }, { label: '停用', value: 0 }] })
    const selectEditor = register.mock.calls.find(call => call[0] === selectName)?.[1]
    selectEditor.createElement('1')
    expect(Array.from(selectEditor.element.options).map((option: any) => option.text)).toEqual(['启用', '停用'])
    selectEditor.setValue('1')
    expect(selectEditor.getValue()).toBe(1)
  })
})
