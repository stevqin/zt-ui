import { defineComponent, h, nextTick, onMounted } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const tableMock = vi.hoisted(() => ({
  setRecords: vi.fn(),
  resize: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  updateColumns: vi.fn(),
}))

vi.mock('@visactor/vue-vtable', () => ({
  ListTable: defineComponent({
    name: 'MockListTable',
    props: ['options', 'records', 'onReady'],
    emits: ['on-checkbox-state-change', 'on-change-cell-value', 'on-sort-click', 'on-click-cell', 'on-dbl-click-cell', 'on-button-click'],
    setup(props, { expose }) {
      expose({ vTableInstance: tableMock })
      onMounted(() => props.onReady?.())
      return () => h('div', { class: 'mock-list-table' })
    },
  }),
}))

import ZtVTableGrid from '../src/components/vtable-grid/ZtVTableGrid.vue'

type Row = { id: number; name: string; amount: number }
const columns = [
  { field: 'name' as const, title: '名称', sort: true },
  { field: 'amount' as const, title: '金额', editable: 'number' as const, summary: 'sum' as const },
]
const rows: Row[] = [
  { id: 1, name: 'Alpha', amount: 10 },
  { id: 2, name: 'Beta', amount: 20 },
]

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

beforeEach(() => {
  Object.values(tableMock).forEach(mock => mock.mockClear())
})

describe('ZtVTableGrid', () => {
  it('loads local records and exposes the table instance', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, toolbar: false, pagination: false } })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith(rows)
    expect((wrapper.vm as any).getTableInstance()).toBe(tableMock)
    expect(wrapper.find('.zt-vtable-grid').exists()).toBe(true)
  })

  it('loads remote data with pagination and form state', async () => {
    const proxyConfig = vi.fn().mockResolvedValue({ data: rows, total: 400 })
    const wrapper = mount(ZtVTableGrid<Row, { keyword: string }>, {
      props: { columns, proxyConfig, formData: { keyword: 'coat' }, currentPage: 2, pageSize: 20 },
    })
    await flushPromises()
    expect(proxyConfig).toHaveBeenCalledWith({ page: 2, pageSize: 20, sort: { order: 'normal' }, form: { keyword: 'coat' } })
    expect(tableMock.setRecords).toHaveBeenLastCalledWith(rows)
    expect(wrapper.text()).toContain('共 400 条')
    expect(wrapper.emitted('loaded')?.[0]?.[0]).toMatchObject({ data: rows, total: 400 })
  })

  it('keeps loading and errors owned by the latest remote query', async () => {
    const first = deferred<{ data: Row[]; total: number }>()
    const second = deferred<{ data: Row[]; total: number }>()
    const proxyConfig = vi.fn().mockImplementationOnce(() => first.promise).mockImplementationOnce(() => second.promise)
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, proxyConfig } })
    await nextTick()
    const latest = (wrapper.vm as any).query()
    first.reject(new Error('stale failure'))
    await flushPromises()
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.emitted('error')).toBeUndefined()
    second.resolve({ data: rows, total: 2 })
    await latest
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('supports query, reload and toolbar events', async () => {
    const proxyConfig = vi.fn().mockResolvedValue({ data: rows, total: 2 })
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, proxyConfig, autoLoad: false, toolbar: ['create', 'import', 'export', 'reload'] },
    })
    expect(proxyConfig).not.toHaveBeenCalled()
    await (wrapper.vm as any).query(true)
    expect(proxyConfig).toHaveBeenCalledTimes(1)
    await wrapper.get('[aria-label="新建"]').trigger('click')
    await wrapper.get('[aria-label="导入"]').trigger('click')
    expect(wrapper.emitted('create')).toHaveLength(1)
    expect(wrapper.emitted('import')).toHaveLength(1)
    await wrapper.get('[aria-label="刷新"]').trigger('click')
    await flushPromises()
    expect(proxyConfig).toHaveBeenCalledTimes(2)
  })

  it('emits pagination models and queries the selected page', async () => {
    const proxyConfig = vi.fn().mockResolvedValue({ data: rows, total: 100 })
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, proxyConfig, pageSize: 10 } })
    await flushPromises()
    await wrapper.get('[aria-label="第 3 页"]').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:currentPage')).toContainEqual([3])
    expect(proxyConfig).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3, pageSize: 10 }))
  })

  it('uses the page size declared inside the pagination config', async () => {
    const proxyConfig = vi.fn().mockResolvedValue({ data: rows, total: 37 })
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, proxyConfig, pagination: { pageSize: 10, pageSizes: [10, 20] } },
    })
    await flushPromises()

    expect(proxyConfig).toHaveBeenCalledWith(expect.objectContaining({ pageSize: 10 }))
    expect(wrapper.get('[aria-label="下一页"]').attributes('disabled')).toBeUndefined()
  })

  it('tracks checkbox selections emitted by VTable', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, checkbox: true, pagination: false } })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-checkbox-state-change', { row: 1, checked: true })
    await nextTick()
    expect((wrapper.vm as any).getSelectedRows()).toEqual([rows[0]])
    expect(wrapper.emitted('selection-change')?.at(-1)?.[0]).toEqual([rows[0]])
    expect(wrapper.text()).toContain('已选 1 行')
  })

  it('selects the current page from the header checkbox and syncs exposed selection changes', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, checkbox: true, pagination: false } })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-checkbox-state-change', { row: 0, checked: true })
    await nextTick()
    expect((wrapper.vm as any).getSelectedKeys()).toEqual([1, 2])

    ;(wrapper.vm as any).clearSelection()
    expect((wrapper.vm as any).getSelectedKeys()).toEqual([])
    expect(tableMock.setRecords).toHaveBeenCalled()
  })

  it('sorts local records before applying pagination', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, pagination: false } })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-sort-click', { field: 'amount', order: 'desc' })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([rows[1], rows[0]])
  })

  it('shows loading, empty and error states', async () => {
    const pending = new Promise(() => {})
    const loading = mount(ZtVTableGrid<Row>, { props: { columns, proxyConfig: () => pending } })
    await nextTick()
    expect(loading.get('[role="status"]').text()).toContain('加载中')

    const empty = mount(ZtVTableGrid<Row>, { props: { columns, records: [], pagination: false } })
    await flushPromises()
    expect(empty.text()).toContain('暂无数据')

    const error = new Error('network')
    const failed = mount(ZtVTableGrid<Row>, { props: { columns, proxyConfig: () => Promise.reject(error) } })
    await flushPromises()
    expect(failed.emitted('error')?.[0]).toEqual([error])
    expect(failed.text()).toContain('加载失败')
  })

  it('tracks, saves and cancels edited cells', async () => {
    const batchSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, editable: true, batchSave, pagination: false },
    })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', {
      row: 1,
      field: 'amount',
      rawValue: 10,
      changedValue: 25,
    })
    await nextTick()
    expect(wrapper.text()).toContain('已修改 1 行 / 1 项')
    await (wrapper.vm as any).saveChanges()
    expect(batchSave).toHaveBeenCalledWith(expect.objectContaining({ changedRowCount: 1, changedCellCount: 1 }))
    expect(wrapper.emitted('save')).toHaveLength(1)

    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', {
      row: 1,
      field: 'amount',
      rawValue: 25,
      changedValue: 30,
    })
    await nextTick()
    ;(wrapper.vm as any).cancelChanges()
    await flushPromises()
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(0)
  })

  it('only enables column editors when editable mode is on', async () => {
    const readonly = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, pagination: false } })
    await flushPromises()
    const readonlyColumns = readonly.findComponent({ name: 'MockListTable' }).props('options').columns
    expect(readonlyColumns.find((column: any) => column.field === 'amount').editor).toBeUndefined()

    const editable = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, editable: true, pagination: false } })
    await flushPromises()
    const editableColumns = editable.findComponent({ name: 'MockListTable' }).props('options').columns
    expect(editableColumns.find((column: any) => column.field === 'amount').editor({
      col: 1, row: 1, table: { getCellOriginRecord: () => rows[0] },
    })).toBe('zt-vtable-number')
  })

  it('keeps changes when batch save fails', async () => {
    const failure = new Error('save failed')
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, editable: true, batchSave: () => Promise.reject(failure), pagination: false },
    })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', {
      row: 1, field: 'name', rawValue: 'Alpha', changedValue: 'New',
    })
    await nextTick()
    await expect((wrapper.vm as any).saveChanges()).rejects.toThrow('save failed')
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(1)
    expect(wrapper.emitted('save-error')?.[0]).toEqual([failure])
  })

  it('opens an accessible row action menu and emits actions', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, showActionsColumn: true, actionButtons: ['detail', 'delete'], pagination: false },
    })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-button-click', { row: 1 })
    await nextTick()
    const menu = wrapper.get('[role="menu"]')
    expect(menu.text()).toContain('查看')
    await menu.get('[role="menuitem"][class*="danger"]').trigger('click')
    expect(wrapper.emitted('action')?.[0]?.[0]).toMatchObject({ type: 'delete', row: rows[0] })
  })

  it('changes column visibility and order through the settings panel', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, columnSettings: true, toolbar: ['columnsetting'], pagination: false },
    })
    await flushPromises()
    await wrapper.get('[aria-label="列设置"]').trigger('click')
    const panel = wrapper.get('[role="dialog"][aria-label="列设置"]')
    expect(panel.text()).toContain('名称')
    await panel.get('[aria-label="隐藏金额列"]').get('.zt-checkbox__input').trigger('click')
    expect(wrapper.emitted('column-settings-change')).toHaveLength(1)
    expect(tableMock.updateColumns).toHaveBeenCalled()
    expect((wrapper.vm as any).exportCsv()).not.toContain('金额')
    await panel.get('[aria-label="上移金额列"]').trigger('click')
    expect(wrapper.emitted('column-settings-change')).toHaveLength(2)
    expect(panel.findAll('.zt-vtable-grid__settings-row').map(row => row.text())).toEqual([
      expect.stringContaining('金额'),
      expect.stringContaining('名称'),
    ])
    expect(panel.get('[aria-label="上移金额列"]').attributes('disabled')).toBeDefined()
  })

  it('filters records, columns and pagination from tableOptions', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, tableOptions: { records: [{ id: 99 }], columns: [], pagination: { currentPage: 9 }, overscrollBehavior: 'none' } },
    })
    await flushPromises()
    const options = wrapper.findComponent({ name: 'MockListTable' }).props('options')
    expect(options.records).toBeUndefined()
    expect(options.pagination).toBeUndefined()
    expect(options.overscrollBehavior).toBe('none')
    expect(options.columns).not.toEqual([])
  })

  it('exports visible records as CSV', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, toolbar: false, pagination: false } })
    await flushPromises()
    const content = (wrapper.vm as any).exportCsv('rows.csv')
    expect(content).toContain('名称,金额')
    expect(content).toContain('Alpha,10')
    expect(wrapper.emitted('export')?.[0]).toEqual([content])
  })

  it('appends a readonly summary record without exposing it as business data', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, summary: { label: '总计' }, toolbar: false, pagination: false },
    })
    await flushPromises()

    expect(tableMock.setRecords).toHaveBeenLastCalledWith([
      ...rows,
      expect.objectContaining({ name: '总计', amount: 30, __zt_grid_summary__: true }),
    ])
    const content = (wrapper.vm as any).exportCsv()
    expect(content).not.toContain('总计')
  })
})
