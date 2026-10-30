import { defineComponent, h, KeepAlive, nextTick, onMounted, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'

const tableMock = vi.hoisted(() => ({ setRecords: vi.fn(), resize: vi.fn(), on: vi.fn(), off: vi.fn(), updateColumns: vi.fn() }))
vi.mock('@visactor/vue-vtable', () => ({
  ListTable: defineComponent({
    name: 'LifecycleMockListTable', props: ['options', 'records', 'onReady'],
    emits: ['on-change-cell-value', 'on-icon-click'],
    setup(props, { expose }) { expose({ vTableInstance: tableMock }); onMounted(() => props.onReady?.()); return () => h('div') },
  }),
}))
import ZtVTableGrid from '../src/components/vtable-grid/ZtVTableGrid.vue'

type Row = { id: number; name: string; amount: number }
const columns = [{ field: 'name', filter: true }, { field: 'amount', editable: 'number' }]
const rows: Row[] = [{ id: 1, name: 'Alpha', amount: 10 }, { id: 2, name: 'Beta', amount: 20 }]
const wrappers: VueWrapper[] = []
function grid(props: Record<string, unknown> = {}, attach = false) {
  const wrapper = mount(ZtVTableGrid, { props: { columns, records: rows, toolbar: false, editable: true, pagination: false, ...props } as any, ...(attach ? { attachTo: document.body } : {}) })
  wrappers.push(wrapper)
  return wrapper
}
function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}
async function edit(wrapper: VueWrapper) {
  await flushPromises()
  wrapper.getComponent({ name: 'LifecycleMockListTable' }).vm.$emit('on-change-cell-value', { row: 1, field: 'amount', rawValue: 10, changedValue: 15 })
  await nextTick()
}
function dimensions(element: Element, width: number, height: number) {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width })
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: height })
}
beforeEach(() => { Object.values(tableMock).forEach(mock => mock.mockClear()) })
afterEach(() => { wrappers.splice(0).forEach(wrapper => { if (wrapper.exists()) wrapper.unmount() }); document.body.innerHTML = ''; vi.restoreAllMocks() })

describe('VTableGrid lifecycle boundaries', () => {
  it.each(['success', 'failure'] as const)('ignores remote %s completed after unmount', async outcome => {
    const pending = deferred<{ data: Row[]; total: number }>()
    const wrapper = grid({ proxyConfig: () => pending.promise })
    await flushPromises()
    wrapper.unmount()
    const writes = tableMock.setRecords.mock.calls.length
    if (outcome === 'success') pending.resolve({ data: rows, total: 2 })
    else pending.reject(new Error('late response'))
    await flushPromises()
    expect(wrapper.emitted('loaded')).toBeUndefined()
    expect(wrapper.emitted('error')).toBeUndefined()
    expect(tableMock.setRecords).toHaveBeenCalledTimes(writes)
  })

  it('does not resize a detached grid while applying local records', async () => {
    const wrapper = grid()
    await flushPromises()
    tableMock.resize.mockClear()
    await (wrapper.vm as any).query(false)
    expect(tableMock.resize).not.toHaveBeenCalled()
  })

  it('does not resize a hidden connected grid while applying local records', async () => {
    const wrapper = grid({}, true)
    await flushPromises()
    dimensions(wrapper.get('.zt-vtable-grid__body').element, 0, 0)
    tableMock.resize.mockClear()
    await (wrapper.vm as any).query(false)
    expect(tableMock.resize).not.toHaveBeenCalled()
  })

  it('resizes a visible cached grid after activation without requerying its data', async () => {
    const shown = ref(true)
    const shell = mount(defineComponent({ setup: () => () => h(KeepAlive, null, { default: () => shown.value ? h(ZtVTableGrid, { columns: columns as any, records: rows, toolbar: false, pagination: false }) : null }) }), { attachTo: document.body })
    wrappers.push(shell)
    await flushPromises()
    const body = shell.get('.zt-vtable-grid__body').element
    dimensions(body, 600, 300)
    shown.value = false
    await nextTick()
    tableMock.resize.mockClear(); tableMock.setRecords.mockClear()
    shown.value = true
    await nextTick(); await nextTick()
    expect(tableMock.resize).toHaveBeenCalledOnce()
    expect(tableMock.setRecords).not.toHaveBeenCalled()
  })

  it('retains draft and skips request when beforeSave returns false', async () => {
    const batchSave = vi.fn()
    const wrapper = grid({ beforeSave: () => false, batchSave })
    await edit(wrapper)
    await (wrapper.vm as any).saveChanges()
    expect(batchSave).not.toHaveBeenCalled()
    expect((wrapper.vm as any).getChanges()).toMatchObject({ changedRowCount: 1, rows: [{ amount: 15 }] })
    expect((wrapper.vm as any).isSaving).toBe(false)
    expect(wrapper.emitted('save-start')).toBeUndefined()
  })

  it('rejects beforeSave errors while retaining draft and allowing retry', async () => {
    const error = new Error('validation unavailable')
    const beforeSave = vi.fn().mockRejectedValueOnce(error).mockResolvedValue(false)
    const batchSave = vi.fn()
    const wrapper = grid({ beforeSave, batchSave })
    await edit(wrapper)
    await expect((wrapper.vm as any).saveChanges()).rejects.toBe(error)
    expect(wrapper.emitted('save-error')?.[0]).toEqual([error])
    expect((wrapper.vm as any).hasChanges).toBe(true)
    expect((wrapper.vm as any).isSaving).toBe(false)
    await (wrapper.vm as any).saveChanges()
    expect(beforeSave).toHaveBeenCalledTimes(2)
    expect(batchSave).not.toHaveBeenCalled()
  })

  it('keeps an in-flight failed save payload detached from subsequent records changes', async () => {
    const pending = deferred<void>()
    const batchSave = vi.fn(() => pending.promise)
    const wrapper = grid({ batchSave })
    await edit(wrapper)
    const save = (wrapper.vm as any).saveChanges()
    await nextTick(); await nextTick()
    await wrapper.setProps({ records: [{ ...rows[0], name: 'Updated' }, rows[1]] })
    expect(batchSave.mock.calls[0][0]).toMatchObject({ rows: [{ name: 'Alpha', amount: 15 }] })
    const failure = new Error('network failed')
    const assertion = expect(save).rejects.toBe(failure)
    pending.reject(failure)
    await assertion; await flushPromises()
    expect((wrapper.vm as any).getChanges().changedRowCount).toBe(1)
    expect(tableMock.setRecords).toHaveBeenLastCalledWith([{ ...rows[0], name: 'Updated', amount: 15 }, rows[1]])
  })

  it('rejects a pending save failure after unmount without emitting component events', async () => {
    const pending = deferred<void>()
    const wrapper = grid({ batchSave: () => pending.promise })
    await edit(wrapper)
    const save = (wrapper.vm as any).saveChanges()
    await nextTick(); await nextTick()
    wrapper.unmount()
    const failure = new Error('late save failure')
    const assertion = expect(save).rejects.toBe(failure)
    pending.reject(failure)
    await assertion
    expect(wrapper.emitted('save-error')).toBeUndefined()
    expect(wrapper.emitted('save')).toBeUndefined()
    expect(wrapper.emitted('saved')).toBeUndefined()
  })

  it('does not clear a draft belonging to a replacement source when an old save completes', async () => {
    const pending = deferred<void>()
    const firstSource = vi.fn(async () => ({ data: rows, total: rows.length }))
    const wrapper = grid({ proxyConfig: firstSource, batchSave: () => pending.promise })
    await edit(wrapper)
    const save = (wrapper.vm as any).saveChanges()
    await nextTick(); await nextTick()
    const replacement = [{ ...rows[0], name: 'Replacement', amount: 30 }, rows[1]]
    await wrapper.setProps({ proxyConfig: async () => ({ data: replacement, total: 2 }) } as any)
    await flushPromises()
    pending.resolve()
    await save; await flushPromises()
    expect((wrapper.vm as any).hasChanges).toBe(true)
    expect((wrapper.vm as any).getChanges().rows[0]).toMatchObject({ name: 'Replacement', amount: 15 })
  })

  it('keeps full local filter state and recomputes enhanced summary over filtered loaded records', async () => {
    const wrapper = grid({ filterConfig: true, localPagination: false, pageSize: 1, summaryConfig: {}, columns: [{ field: 'name', filter: true }, { field: 'amount', summary: 'sum' }] })
    await flushPromises()
    const table = wrapper.getComponent({ name: 'LifecycleMockListTable' })
    table.vm.$emit('on-icon-click', { col: 0, row: 0, icon: { funcType: 'zt-grid-filter' }, event: { clientX: 20, clientY: 20 } })
    await nextTick()
    const beta = wrapper.findAll('input[type="checkbox"]').find(item => item.attributes('aria-label') === '筛选 Beta')!
    await beta.setValue(false)
    await wrapper.get('[aria-label="应用筛选"]').trigger('click')
    await flushPromises()
    expect(tableMock.setRecords.mock.calls.at(-1)![0]).toEqual([rows[0], expect.objectContaining({ amount: 10 })])
    await (wrapper.vm as any).query(false)
    expect(tableMock.setRecords.mock.calls.at(-1)![0]).toEqual([rows[0], expect.objectContaining({ amount: 10 })])
    expect(wrapper.findComponent({ name: 'ZtPagination' }).exists()).toBe(false)
  })
})
