import { defineComponent, h, onMounted } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
const state = vi.hoisted(() => ({
  link: vi.fn((text: string, args: any, options: any, click: Function) => ({ text, options, click: (event: unknown) => click({}, event) })),
  table: { setRecords: vi.fn(), resize: vi.fn(), on: vi.fn(), off: vi.fn(), updateColumns: vi.fn() },
}))
vi.mock('@visactor/vue-vtable', () => ({ ListTable: defineComponent({ name: 'LinkTable', props: ['options', 'records', 'onReady'], setup(props, { expose }) { expose({ vTableInstance: state.table }); onMounted(() => props.onReady?.()); return () => h('div') } }) }))
vi.mock('../src/components/vtable-grid/canvas-layout', () => ({ createGridCanvasRenderer: () => ({ createLinkLayout: state.link }) }))
import Grid from '../src/components/vtable-grid/ZtVTableGrid.vue'
it('dispatches business link events with evaluated parameters and blocks busy and aggregation cells', async () => {
  const row = { id: 'p1', name: '商品' }
  const handler = vi.fn()
  const w = mount(Grid, { props: { columns: [{ field: 'name', link: { params: (value: typeof row) => ({ code: value.id }), handler } }], records: [row], pagination: false, toolbar: false } })
  try {
    await flushPromises()
    const options = w.getComponent({ name: 'LinkTable' }).props('options')
    const column = options.columns.find((item: any) => item.field === 'name')
    const args = { col: 0, row: 1, table: { getCellOriginRecord: () => row, getCellValue: () => row.name } }
    const cell = column.customLayout(args)
    const event = { pointer: true }
    cell.click(event)
    expect(handler).toHaveBeenCalledWith(row, { row, field: 'name', value: '商品', rowIndex: 0, params: { code: 'p1' }, event })
    expect(w.emitted('link-click')?.[0]).toEqual([{ row, field: 'name', value: '商品', rowIndex: 0, params: { code: 'p1' }, event }])
    await w.setProps({ disabled: true })
    cell.click(event)
    expect(handler).toHaveBeenCalledTimes(1)
    const calls = state.link.mock.calls.length
    column.customLayout({ ...args, table: { ...args.table, getCellOriginRecord: () => undefined, isAggregation: () => true } })
    expect(state.link).toHaveBeenCalledTimes(calls)
  } finally { w.unmount() }
})
