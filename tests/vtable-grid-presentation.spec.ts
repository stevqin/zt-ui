import { describe, expect, it, vi } from 'vitest'
import { buildVTableColumns } from '../src/components/vtable-grid/columns'
import { normalizeGridEditorValue, registerGridEditors, editorName } from '../src/components/vtable-grid/editors'
import { resolveGridPresentation } from '../src/components/vtable-grid/presentation'

const adapt = (column: any) => buildVTableColumns([column], { settings: { order: [column.field], visible: [column.field], hidden: [] }, checkbox: false, showActionsColumn: false })[0] as any

describe('grid presentation', () => {
  it('merges alignment into object and function styles without losing properties', () => {
    const col = adapt({ field: 'a', align: 'right', style: () => ({ color: 'red' }), headerStyle: { fontWeight: 700 }, ellipsis: '…' })
    expect(col.style({})).toMatchObject({ color: 'red', textAlign: 'right', autoWrapText: false, textOverflow: '…' })
    expect(col.headerStyle).toEqual({ fontWeight: 700, textAlign: 'right' })
    expect(col.__showOverflowTooltip).toBe(true)
  })
  it('honors explicit resizing and preserves width limits and image/boolean defaults', () => {
    expect(adapt({ field: 'a', width: 100, minWidth: 50, maxWidth: 200, resizable: true })).toMatchObject({ width: 100, minWidth: 50, maxWidth: 200, disableColumnResize: false })
    expect(adapt({ field: 'a', width: 100 }).disableColumnResize).toBe(true)
    expect(adapt({ field: 'a', editable: 'image' })).toMatchObject({ cellType: 'image', clickToPreview: false })
    expect(adapt({ field: 'a', editable: 'checkbox' })).toMatchObject({ cellType: 'checkbox', headerType: 'text' })
  })
  it('protects internal columns from reserved business definitions', () => {
    const columns = buildVTableColumns([{ field: '__zt_grid_checked__', width: 999 }], { settings: { order: ['__zt_grid_checked__'], visible: ['__zt_grid_checked__'], hidden: [] }, checkbox: true, showActionsColumn: false }) as any[]
    expect(columns).toHaveLength(1)
    expect(columns[0].width).toBe(42)
  })
  it('normalizes numbers and checkbox values without coercing select identities', () => {
    expect(normalizeGridEditorValue('number', '12.5')).toBe(12.5)
    expect(normalizeGridEditorValue('number', '')).toBe('')
    expect(normalizeGridEditorValue('checkbox', 'false')).toBe(false)
    expect(normalizeGridEditorValue('checkbox', '1')).toBe(true)
    expect(normalizeGridEditorValue('image', ' https://a.test/x ')).toBe('https://a.test/x')
    expect(normalizeGridEditorValue({ type: 'select', options: [{ label: 'A', value: 0 }] }, '0')).toBe(0)
  })
  it('preserves numeric editor values and distinct string/number select identities', () => {
    const register = vi.fn()
    registerGridEditors(register)
    const name = editorName({ type: 'select', options: [{ label: '数字', value: 1 }, { label: '字符串', value: '1' }] })
    const editor = register.mock.calls.find(call => call[0] === name)?.[1]
    editor.createElement(1)
    expect(editor.getValue()).toBe(1)
    editor.setValue('1')
    expect(editor.getValue()).toBe('1')
    expect(normalizeGridEditorValue({ type: 'select', options: [1, '1'] }, '1')).toBe('1')
    const numberName = editorName({ type: 'number', min: 13.5, max: 99 })
    const numberEditor = register.mock.calls.find(call => call[0] === numberName)?.[1]
    numberEditor.container = document.createElement('div')
    numberEditor.createElement()
    numberEditor.element.value = '14.5'
    expect(numberEditor.getValue()).toBe(14.5)
  })
  it('resolves size, borders, selection, and state style priority', () => {
    const opts = resolveGridPresentation({ rowHeight: 'auto', headerRowHeight: 52, stripe: true, borderMode: 'row', hoverMode: 'row', cellSelection: false, editableCellStyle: { bgColor: 'edit' }, isRowSelected: () => true, isCellChanged: () => true }, 'small', 'dark')
    expect(opts).toMatchObject({ heightMode: 'autoHeight', defaultHeaderRowHeight: 52, select: { disableSelect: false }, hover: { highlightMode: 'row' } })
    expect(opts.resolveCellStyle({ table: { getCellOriginRecord: () => ({}) }, row: 2 }, { bgColor: 'column' }, true).bgColor).toBe(opts.changedCellStyle.bgColor)
    expect(opts.selectionStyle).toMatchObject({ cellBgColor: 'transparent', cellBorderColor: 'transparent' })
    expect(resolveGridPresentation({ headerStyle: { color: 'purple' } }).headerStyle.color).toBe('purple')
    expect(opts.bodyStyle.borderLineWidth).toEqual([0, 0, 1, 0])
  })
})
