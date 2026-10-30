import { defineComponent, h, nextTick, onMounted } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { register } from '@visactor/vtable'

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
    emits: ['on-checkbox-state-change', 'on-change-cell-value', 'on-sort-click', 'on-click-cell', 'on-dbl-click-cell', 'on-button-click', 'on-context-menu-cell', 'on-icon-click', 'on-pasted-data', 'on-change-header-position'],
    setup(props, { expose }) {
      expose({ vTableInstance: tableMock })
      onMounted(() => props.onReady?.())
      return () => h('div', { class: 'mock-list-table' })
    },
  }),
}))

import ZtVTableGrid from '../src/components/vtable-grid/ZtVTableGrid.vue'
import { ZtConfigProvider } from '../src/components/config-provider'
import ZtModal from '../src/components/modal/ZtModal.vue'

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
  it.each(['light', 'dark'] as const)('uses one outer frame under the %s theme', async theme => {
    const wrapper = mount(ZtConfigProvider, {
      props: { theme, borderRadius: 11 },
      slots: { default: () => h(ZtVTableGrid, { columns, records: rows, pagination: false }) },
    })
    try {
      await flushPromises()
      const options = wrapper.getComponent({ name: 'MockListTable' }).props('options')
      expect(options.theme.frameStyle).toMatchObject({ cornerRadius: 0, borderLineWidth: 0, shadowBlur: 0 })
    } finally { wrapper.unmount() }
  })
  it('spins and locks the toolbar during a refresh and unlocks after failure', async () => {
    const pending = deferred<{ data: Row[]; total: number }>()
    const proxyConfig = vi.fn(() => pending.promise)
    const wrapper = mount(ZtVTableGrid, { props: { columns, proxyConfig, autoLoad: false, toolbarConfig: ['reload', 'export', 'create', 'import', 'columnsetting'] } })
    try {
      await wrapper.get('[aria-label="刷新"]').trigger('click')
      expect(wrapper.get('[aria-label="刷新"] .zt-icon-glyph').classes()).toContain('is-spin')
      for (const label of ['刷新', '导出', '新建', '导入', '列设置']) expect(wrapper.get(`[aria-label="${label}"]`).attributes('disabled')).toBeDefined()
      await wrapper.get('[aria-label="刷新"]').trigger('click')
      expect(proxyConfig).toHaveBeenCalledTimes(1)
      pending.reject(new Error('refresh failed'))
      await flushPromises()
      expect(wrapper.get('[aria-label="刷新"]').attributes('disabled')).toBeUndefined()
      expect(wrapper.get('[aria-label="刷新"] .zt-icon-glyph').classes()).not.toContain('is-spin')
    } finally { wrapper.unmount() }
  })

  it('owns async export loading, rejects duplicate clicks and allows retry after failure', async () => {
    const pending = deferred<void>()
    const exportMethod = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValue(undefined)
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, toolbarConfig: ['export', 'reload', 'create', 'import', 'columnsetting'], exportMethod } as any })
    try {
      await flushPromises()
      await wrapper.get('[aria-label="列设置"]').trigger('click')
      expect(wrapper.find('[aria-label="列设置"][role="dialog"]').exists()).toBe(true)
      const button = wrapper.get('[aria-label="导出"]')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('[aria-label="列设置"][role="dialog"]').exists()).toBe(false)
      expect(exportMethod).toHaveBeenCalledTimes(1)
      expect(exportMethod.mock.calls[0]?.[0]).toMatchObject({ records: rows, columns, selectedRows: [] })
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.find('.zt-button__spinner').exists()).toBe(true)
      for (const label of ['刷新', '新建', '导入', '列设置']) expect(wrapper.get(`[aria-label="${label}"]`).attributes('disabled')).toBeDefined()
      await button.trigger('click')
      expect(exportMethod).toHaveBeenCalledTimes(1)
      pending.reject(new Error('export failed'))
      await flushPromises()
      expect(wrapper.emitted('error')?.at(-1)?.[0]).toMatchObject({ message: 'export failed' })
      expect(button.attributes('disabled')).toBeUndefined()
      await button.trigger('click')
      await flushPromises()
      expect(exportMethod).toHaveBeenCalledTimes(2)
      expect(button.attributes('disabled')).toBeUndefined()
    } finally { wrapper.unmount() }
  })

  it('bridges legacy export-request to controlled loading without duplicate events', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, toolbarConfig: ['export'], exportMode: 'external', onExportRequest: () => { void wrapper.setProps({ exportLoading: true }) } } })
    try {
      await flushPromises()
      const button = wrapper.get('[aria-label="导出"]')
      button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()
      expect(wrapper.emitted('export-request')).toHaveLength(1)
      expect(wrapper.emitted('toolbar-action')).toHaveLength(1)
      expect(button.attributes('disabled')).toBeDefined()
      await wrapper.setProps({ exportLoading: false })
      expect(button.attributes('disabled')).toBeUndefined()
      await button.trigger('click')
      expect(wrapper.emitted('export-request')).toHaveLength(2)
    } finally { wrapper.unmount() }
  })

  it('locks native CSV until it has painted and serialized, without duplicate downloads', async () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.push(callback); return frames.length })
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, toolbarConfig: ['export'] } })
    try {
      await flushPromises()
      const button = wrapper.get('[aria-label="导出"]')
      button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      button.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.find('.zt-button__spinner').exists()).toBe(true)
      expect(wrapper.emitted('export')).toBeUndefined()
      while (frames.length) frames.shift()!(0)
      await flushPromises()
      expect(wrapper.emitted('export')).toHaveLength(1)
      expect(button.attributes('disabled')).toBeUndefined()
    } finally { wrapper.unmount(); vi.unstubAllGlobals() }
  })

  it('passes busy state to a complete custom search form slot', async () => {
    const form = vi.fn(() => h('span', '自定义搜索'))
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, loading: true, toolbar: false }, slots: { form } })
    try {
      await flushPromises()
      expect(form.mock.calls.at(-1)?.[0]).toMatchObject({ loading: true, disabled: true, exportLoading: false, size: 'default' })
    } finally { wrapper.unmount() }
  })

  it('renders explicit footer slots even when pagination and checkboxes are off', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, pagination: false, checkbox: false, toolbar: false }, slots: { 'pager-left': ({ total }: { total: number }) => h('span', `统计 ${total} 行`), 'pager-right': () => h('span', '自定义底栏') } })
    try {
      await flushPromises()
      expect(wrapper.get('.zt-vtable-grid__footer').text()).toContain('统计 2 行')
      expect(wrapper.get('.zt-vtable-grid__footer').text()).toContain('自定义底栏')
    } finally { wrapper.unmount() }
  })

  it('restores displayed records after global theme or size updates native options', async () => {
    const wrapper = mount(ZtConfigProvider, {
      props: { theme: 'light', size: 'default' },
      slots: { default: () => h(ZtVTableGrid, { columns, records: rows, pagination: false }) },
    })
    await flushPromises()
    tableMock.setRecords.mockClear()
    await wrapper.setProps({ theme: 'dark', size: 'large' })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith(rows)
    wrapper.unmount()
  })
  it('loads local records and exposes the table instance', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, toolbar: false, pagination: false } })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith(rows)
    expect((wrapper.vm as any).getTableInstance()).toBe(tableMock)
    expect(wrapper.find('.zt-vtable-grid').exists()).toBe(true)
  })

  it('applies every declared size and forwards it to pagination', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, size: 'medium', pagination: { pageSize: 1 } },
    })
    await flushPromises()
    expect(wrapper.classes()).toContain('zt-vtable-grid--medium')
    expect(wrapper.findComponent({ name: 'ZtPagination' }).props('size')).toBe('medium')
    expect(wrapper.findComponent({ name: 'MockListTable' }).props('options')).toMatchObject({
      defaultRowHeight: 40,
      defaultHeaderRowHeight: 44,
    })
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

  it('refreshes selected row objects without emitting a false selection change', async () => {
    const refreshed = [{ ...rows[0], name: 'Alpha refreshed' }, rows[1]]
    const proxyConfig = vi.fn().mockResolvedValueOnce({ data: rows, total: 2 }).mockResolvedValueOnce({ data: refreshed, total: 2 })
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, proxyConfig, checkbox: true, toolbar: false },
      slots: {
        'toolbar-left': ({ selectedRows }: { selectedRows: Row[] }) => h('span', { class: 'selected-name' }, selectedRows[0]?.name ?? 'none'),
      },
    })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-checkbox-state-change', { row: 1, checked: true })
    await nextTick()
    expect(wrapper.get('.selected-name').text()).toBe('Alpha')
    expect(wrapper.emitted('selection-change')).toHaveLength(1)

    await (wrapper.vm as any).reload()
    await nextTick()
    expect(wrapper.get('.selected-name').text()).toBe('Alpha refreshed')
    expect(wrapper.emitted('selection-change')).toHaveLength(1)
  })

  it('sorts local records before applying pagination', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns, records: rows, pagination: false } })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-sort-click', { field: 'amount', order: 'desc' })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([rows[1], rows[0]])
  })

  it('uses custom column comparators for local scalar and array sort fields', async () => {
    const customRows: Row[] = [
      { id: 1, name: 'First', amount: 12 },
      { id: 2, name: 'Second', amount: 21 },
    ]
    const customColumns = [
      columns[0],
      { ...columns[1], sort: (left: unknown, right: unknown) => Number(left) % 10 - Number(right) % 10 },
    ]
    const wrapper = mount(ZtVTableGrid<Row>, { props: { columns: customColumns, records: customRows, pagination: false } })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MockListTable' })
    table.vm.$emit('on-sort-click', { field: 'amount', order: 'asc' })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([customRows[1], customRows[0]])

    table.vm.$emit('on-sort-click', { field: ['amount'], order: 'desc' })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([customRows[0], customRows[1]])
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

  it('blocks Canvas interactions while disabled', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, checkbox: true, editable: true, showActionsColumn: true, disabled: true, pagination: false },
    })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MockListTable' })
    const nativeColumns = table.props('options').columns
    const checkbox = nativeColumns.find((column: any) => column.field === '__zt_grid_checked__')
    const amount = nativeColumns.find((column: any) => column.field === 'amount')
    const cell = { col: 0, row: 1, table: { getCellOriginRecord: () => rows[0] } }
    expect(checkbox.disable(cell)).toBe(true)
    expect(amount.editor).toBeUndefined()
    expect(amount.sort).toBe(false)

    table.vm.$emit('on-checkbox-state-change', { row: 1, checked: true })
    table.vm.$emit('on-sort-click', { field: 'amount', order: 'desc' })
    table.vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 99 })
    table.vm.$emit('on-click-cell', { row: 1 })
    table.vm.$emit('on-dbl-click-cell', { row: 1 })
    table.vm.$emit('on-button-click', { row: 1 })
    await nextTick()

    expect((wrapper.vm as any).getSelectedRows()).toEqual([])
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(0)
    expect(wrapper.emitted('selection-change')).toBeUndefined()
    expect(wrapper.emitted('sort-change')).toBeUndefined()
    expect(wrapper.emitted('cell-change')).toBeUndefined()
    expect(wrapper.emitted('row-click')).toBeUndefined()
    expect(wrapper.emitted('row-dblclick')).toBeUndefined()
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
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

  it('keeps column settings inside the parent modal focus scope and restores its trigger on Escape', async () => {
    const wrapper = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: { default: () => h(ZtVTableGrid, { columns, records: rows, columnSettings: true, toolbar: ['columnsetting'], pagination: false }) },
    })
    try {
      await flushPromises()
      const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="列设置"]')!
      trigger.click()
      await nextTick()
      const panel = document.querySelector<HTMLElement>('[role="dialog"][aria-label="列设置"]')!
      const checkbox = panel.querySelector<HTMLInputElement>('input[type=checkbox]')!
      checkbox.focus()
      checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await nextTick()
      expect(document.querySelector('[role="dialog"][aria-label="列设置"]')).toBeNull()
      expect(document.activeElement).toBe(trigger)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally { wrapper.unmount() }
  })

  it('changes column visibility and order through the settings panel', async () => {
    const wrapper = mount(ZtVTableGrid<Row>, {
      props: { columns, records: rows, columnSettings: true, toolbar: ['columnsetting'], pagination: false },
    })
    await flushPromises()
    await wrapper.get('[aria-label="列设置"]').trigger('click')
    const panel = wrapper.get('[role="dialog"][aria-label="列设置"]')
    expect(panel.text()).toContain('名称')
    await panel.get('[aria-label="隐藏金额列"]').get('input[type=checkbox]').setValue(false)
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

describe('VTableGrid enhanced state', () => {
  it('retains local pagination by default and supports full local filtered data', async () => {
    const wrapper = mount(ZtVTableGrid, { props: {
      columns, records: rows, pageSize: 1, localPagination: false,
      formData: { keyword: 'Beta' }, filterMethod: (row: Row, form: any) => row.name.includes(form.keyword),
    } as any })
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([rows[1]])
    expect(wrapper.findComponent({ name: 'ZtPagination' }).exists()).toBe(false)
    await wrapper.setProps({ formData: { keyword: '' } } as any)
    await (wrapper.vm as any).query()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith(rows)
    wrapper.unmount()
  })

  it('skips ineligible checkbox rows including exposed key selection', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, checkbox: true,
      checkboxCheckMethod: (row: Row) => row.id !== 2,
    } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-checkbox-state-change', { row: 0, checked: true })
    expect((wrapper.vm as any).getSelectedKeys()).toEqual([1])
    ;(wrapper.vm as any).setSelectedKeys([2])
    expect((wrapper.vm as any).getSelectedKeys()).toEqual([])
    wrapper.unmount()
  })

  it('tracks local inserted/deleted records and restores a separate snapshot', async () => {
    const source = rows.map(row => ({ ...row }))
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: [source[1], { id: 3, name: 'Gamma', amount: 30 }],
      originalRecords: source, editable: true,
    } as any })
    await flushPromises()
    const vm = wrapper.vm as any
    expect(vm.hasChanges).toBe(true)
    expect(vm.getEditChanges()).toMatchObject({ changedRowCount: 2, insertedRows: [{ id: 3 }], deletedRows: [{ id: 1 }] })
    await vm.cancelChanges()
    expect(wrapper.emitted('update:records')?.[0]?.[0]).toEqual(rows)
    expect(wrapper.emitted('update:records')?.[0]?.[0]).not.toBe(source)
    wrapper.unmount()
  })

  it('does not track drafts when batchEdit is false while keeping editors enabled', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, editable: true, batchEdit: false } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 11 })
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(0)
    expect(wrapper.emitted('cell-change')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps drafts when confirmation declines and serializes concurrent saves', async () => {
    const decision = deferred<boolean>()
    const confirm = vi.fn(() => decision.promise)
    const save = vi.fn(async () => {})
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, editable: true, batchSave: save, saveConfirm: confirm } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 11 })
    const first = (wrapper.vm as any).saveChanges()
    const second = (wrapper.vm as any).saveChanges()
    expect((wrapper.vm as any).isSaving).toBe(true)
    decision.resolve(false)
    await Promise.all([first, second])
    expect(confirm).toHaveBeenCalledTimes(1)
    expect(save).not.toHaveBeenCalled()
    expect((wrapper.vm as any).hasChanges).toBe(true)
    wrapper.unmount()
  })

  it('preserves save success events and rejects failed programmatic saves', async () => {
    const order: string[] = []
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, editable: true,
      batchSave: async () => { order.push('request') },
      onSaveStart: () => order.push('start'), onSave: () => order.push('save'), onSaved: () => order.push('saved'),
    } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 11 })
    await (wrapper.vm as any).saveChanges()
    expect(order).toEqual(['start', 'request', 'save', 'saved'])
    wrapper.unmount()
  })
})

describe('VTableGrid integrated interactions', () => {
  it('keeps editable boolean cells separate from row checkbox selection', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns: [{ field: 'active', editable: 'checkbox' }], records: [{ id: 1, active: false }], editable: true, checkbox: true } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-checkbox-state-change', { row: 1, col: 1, field: 'active', checked: true })
    expect((wrapper.vm as any).getChanges()).toMatchObject({ changedCellCount: 1, rows: [{ active: true }] })
    expect((wrapper.vm as any).getSelectedKeys()).toEqual([])
    wrapper.unmount()
  })

  it('freezes enhanced summaries without mixing missing backend fields with page calculations', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns: [{ field: 'name' }, { field: 'amount', summary: 'sum' }], proxyConfig: async () => ({ data: rows, total: 200, summary_data: {} }), summaryConfig: { label: { fields: ['name'] } } } as any })
    await flushPromises()
    const records = tableMock.setRecords.mock.calls.at(-1)![0]
    expect(records.at(-1)).toMatchObject({ name: '全量合计', amount: '' })
    expect(wrapper.findComponent({ name: 'MockListTable' }).props('options').bottomFrozenRowCount).toBe(1)
    wrapper.unmount()
  })

  it('only exposes header filters for declared columns and filters loaded data', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns: [{ field: 'name', title: '名称', filter: true }, { field: 'amount' }], records: rows, filterConfig: true, localPagination: false } as any })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MockListTable' })
    const options = table.props('options')
    expect(options.columns[0].headerIcon).toBeTruthy()
    expect(options.columns[1].headerIcon).toBeUndefined()
    table.vm.$emit('on-icon-click', { col: 0, row: 0, funcType: 'zt-grid-filter', icon: { attribute: { funcType: 'zt-grid-filter' } }, event: { clientX: 80, clientY: 80 } })
    await nextTick()
    expect(wrapper.text()).toContain('筛选名称')
    const choice = wrapper.findAll('input[type="checkbox"]').find(item => item.attributes('aria-label') === '筛选 Beta')!
    await choice.setValue(false)
    await wrapper.get('[aria-label="应用筛选"]').trigger('click')
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([rows[0]])
    expect(wrapper.emitted('filter-change')?.at(-1)?.[0]).toEqual([rows[0]])
    wrapper.unmount()
  })

  it('dispatches external export without generating CSV and includes scoped slot state', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, toolbarConfig: ['export'], exportMode: 'external' } as any, slots: { 'toolbar-left': (scope: any) => h('span', `size:${scope.size};checkbox:${scope.checkbox}`) } })
    await flushPromises()
    await wrapper.get('[aria-label="导出"]').trigger('click')
    expect(wrapper.emitted('export-request')).toHaveLength(1)
    expect(wrapper.emitted('export')).toBeUndefined()
    expect(wrapper.text()).toContain('size:default;checkbox:false')
    wrapper.unmount()
  })
})

describe('VTableGrid option lifecycle', () => {
  it('reuses the loader after changing editor sources without leaking prior options', async () => {
    const loader = vi.fn(async (source: string) => [{ label: source, value: source }])
    const wrapper = mount(ZtVTableGrid, { props: { columns: [{ field: 'name', editable: { type: 'select', optionSource: 'first' } }], records: rows, editable: true, optionLoader: loader } as any })
    await flushPromises()
    await wrapper.setProps({ columns: [{ field: 'name', editable: { type: 'select', optionSource: 'second' } }] } as any)
    await flushPromises()
    expect(loader.mock.calls.map(call => call[0])).toContain('second')
    expect(wrapper.emitted('error')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('VTableGrid native event adapter', () => {
  it('receives vue-vtable context-menu-cell and pasted-data events', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, rowContextMenu: [{ type: 'inspect', text: '检查记录' }] } as any })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'MockListTable' })
    table.vm.$emit('on-context-menu-cell', { row: 1, col: 0, event: { clientX: 40, clientY: 40, preventDefault() {} } })
    await flushPromises()
    expect(wrapper.find('[role="menuitem"]').text()).toContain('检查记录')
    table.vm.$emit('on-pasted-data', { values: [['updated']] })
    expect(wrapper.emitted('paste')?.[0]?.[0]).toEqual({ values: [['updated']] })
    wrapper.unmount()
  })
})

it('keeps a menu opened by the same bubbling Canvas pointer event', async () => {
  const wrapper = mount(ZtVTableGrid, { attachTo: document.body, props: { columns, records: rows, rowContextMenu: [{ type: 'inspect', text: '同事件菜单' }] } as any })
  await flushPromises()
  const table = wrapper.findComponent({ name: 'MockListTable' })
  table.element.addEventListener('pointerdown', event => table.vm.$emit('on-context-menu-cell', { row: 1, col: 0, event }))
  table.element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 2, clientX: 40, clientY: 40 }))
  await flushPromises()
  expect(document.querySelector('[role="menuitem"]')?.textContent).toContain('同事件菜单')
  wrapper.unmount()
})

it('updates default Canvas content typography with the Grid size', async () => {
  const wrapper = mount(ZtVTableGrid, { props: { records: rows, columns: [{ field: 'name', render: ({ row }: any) => h('span', row.name) }], size: 'default' } as any })
  await flushPromises()
  await vi.waitFor(() => expect(wrapper.findComponent({ name: 'MockListTable' }).props('options').columns[0].customLayout).toBeTypeOf('function'))
  const args = { col: 0, row: 1, table: { getCellRect: () => ({ width: 200, height: 44 }), getCellOriginRecord: () => rows[0], frozenRowCount: 1 } }
  const font = () => wrapper.findComponent({ name: 'MockListTable' }).props('options').columns[0].customLayout(args).rootContainer.getChildren()[0].attribute.fontSize
  expect(font()).toBe(13)
  await wrapper.setProps({ size: 'large' })
  await flushPromises()
  expect(font()).toBe(15)
  wrapper.unmount()
})

it('registers header filtering icons with the VTable positionType contract', () => {
  expect(register.icon('zt-grid-filter')).toMatchObject({ positionType: 'right', funcType: 'zt-grid-filter' })
})

describe('VTableGrid review regressions', () => {
  it('restores local originals after reload and cancellation on another page', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, pageSize: 1, editable: true } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 15 })
    await (wrapper.vm as any).reload()
    wrapper.findComponent({ name: 'ZtPagination' }).vm.$emit('update:currentPage', 2)
    await flushPromises()
    await (wrapper.vm as any).cancelChanges()
    wrapper.findComponent({ name: 'ZtPagination' }).vm.$emit('update:currentPage', 1)
    await flushPromises()
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([rows[0]])
    expect((wrapper.vm as any).hasChanges).toBe(false)
    wrapper.unmount()
  })

  it('preserves snapshot drafts when records refresh during a failed save', async () => {
    const pending = deferred<void>()
    const original = rows.map(row => ({ ...row }))
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: original.map(row => ({ ...row })), originalRecords: original, editable: true, batchSave: () => pending.promise } as any })
    await flushPromises()
    wrapper.findComponent({ name: 'MockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 15 })
    const save = (wrapper.vm as any).saveChanges()
    await nextTick(); await nextTick()
    await wrapper.setProps({ records: [{ ...rows[0], name: 'Refreshed' }, rows[1]] })
    const assertion = expect(save).rejects.toThrow('failed')
    pending.reject(new Error('failed'))
    await assertion; await flushPromises()
    expect((wrapper.vm as any).getChanges()).toMatchObject({ changedRowCount: 1, rows: [{ amount: 15, name: 'Refreshed' }] })
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([{ ...rows[0], name: 'Refreshed', amount: 15 }, rows[1]])
    wrapper.unmount()
  })

  it('disables snapshot tracking when batchEdit is explicitly false', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns, records: [{ ...rows[0], amount: 11 }], originalRecords: rows, editable: true, batchEdit: false } as any })
    await flushPromises()
    expect((wrapper.vm as any).hasChanges).toBe(false)
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(0)
    expect(wrapper.text()).not.toContain('保存修改')
    wrapper.unmount()
  })

  it('connects per-column overflow tooltip flags to the native callback', async () => {
    const wrapper = mount(ZtVTableGrid, { props: { columns: [{ field: 'name', ellipsis: true, showOverflowTooltip: true }, { field: 'amount', ellipsis: true, showOverflowTooltip: false }], records: rows } as any })
    await flushPromises()
    const options = wrapper.findComponent({ name: 'MockListTable' }).props('options')
    expect(options.tooltip?.isShowOverflowTextTooltip).toBeTypeOf('function')
    expect(options.tooltip.isShowOverflowTextTooltip(0, 1, tableMock)).toBe(true)
    expect(options.tooltip.isShowOverflowTextTooltip(1, 1, tableMock)).toBe(false)
    wrapper.unmount()
  })
})
