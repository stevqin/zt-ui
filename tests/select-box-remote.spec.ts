import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import { ztFormItemKey } from '../src/components/form/context'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteResult } from '../src/components/select-box/types'

const options = [{ value: 'east', label: '华东' }, { value: 'south', label: '华南' }]
const wrappers: VueWrapper[] = []
function box(props: ZtSelectBoxProps = {}, provide = {}) {
  const wrapper = mount(ZtSelectBox, { attachTo: document.body, props: { options, ...props }, global: { provide } })
  wrappers.push(wrapper)
  return wrapper
}
const trigger = (w: VueWrapper) => w.find('[role="combobox"]')
const popup = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const rows = () => [...document.querySelectorAll('.zt-select-box-panel__option')]
async function click(selector: string) { (document.querySelector(selector) as HTMLElement).click(); await flushPromises() }
async function open(w: VueWrapper) { await trigger(w).trigger('click'); await flushPromises() }
async function search(w: VueWrapper, text: string) { await w.findComponent(SelectBoxPanel).find('input[aria-label="搜索选项"]').setValue(text) }
const result = (label: string, total = 60): ZtSelectBoxRemoteResult => ({ mode: 'search', options: [{ value: label, label }], total })
function deferred() { let resolve!: (value: ZtSelectBoxRemoteResult) => void; let reject!: (error: unknown) => void; const promise = new Promise<ZtSelectBoxRemoteResult>((res, rej) => { resolve = res; reject = rej }); return { promise, resolve, reject } }
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); vi.useRealTimers(); document.body.innerHTML = '' })

describe('standalone SelectBox trigger', () => {
  it('renders numeric and CSS widths, placeholder, and an accessible titled single-line summary', async () => {
    const w = box({ width: 280, placeholder: '选择区域' })
    expect(w.find('.zt-select-box').attributes('style')).toContain('280px')
    expect(trigger(w).attributes('aria-haspopup')).toBe('dialog')
    expect(trigger(w).text()).toContain('选择区域')
    await w.setProps({ width: '80%', modelValue: ['east', 'south'] })
    expect(w.find('.zt-select-box').attributes('style')).toContain('80%')
    expect(w.find('.zt-select-box__summary').attributes('title')).toBe('华东, 华南')
    expect(w.find('.zt-select-box__summary').text()).toBe('华东, 华南')
  })
  it('focuses search on open, retains blank clicks, and restores trigger focus on Escape', async () => {
    const w = box()
    await open(w)
    expect(popup()).not.toBeNull()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('搜索选项')
    await click('.zt-select-box-panel__footer')
    expect(popup()).not.toBeNull()
    await w.findComponent(SelectBoxPanel).trigger('keydown', { key: 'Escape' })
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(trigger(w).element)
    expect(w.emitted('visible-change')).toEqual([[true], [false]])
  })
  it('outside click cancels the draft and reopening restores confirmed values', async () => {
    const w = box({ modelValue: ['south'] })
    await open(w)
    await click('.zt-select-box-panel__option')
    document.body.click(); await flushPromises()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(popup()).toBeNull()
    await open(w)
    expect(rows().map(row => row.getAttribute('aria-checked'))).toEqual(['false', 'true'])
  })
  it('keeps the outer panel open when interacting with the teleported separator Select', async () => {
    const w = box()
    await open(w)
    await click('.zt-select-box-panel__mode')
    await click('.zt-select-box-panel__separator [role="combobox"]')
    await click('[role="option"]')
    expect(popup()).not.toBeNull()
    expect(w.emitted('visible-change')).toEqual([[true]])
  })
  it('commits only on confirmation, emits in order, and validates the form', async () => {
    const validate = vi.fn().mockResolvedValue(true)
    const w = box({}, { [ztFormItemKey as symbol]: { size: computed(() => 'default'), disabled: computed(() => false), validate, inputId: 'field', errorId: 'error', validateState: ref(''), validateMessage: ref(''), element: ref(), prop: 'region', resetField: () => {}, clearValidate: () => {} } })
    const events: string[] = []
    await w.setProps({ 'onUpdate:modelValue': () => events.push('update'), onChange: () => events.push('change') })
    await open(w); await search(w, '华'); await click('.zt-select-box-panel__option')
    expect(validate).not.toHaveBeenCalled()
    expect(w.emitted('change')).toBeUndefined()
    await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east']]])
    expect(events).toEqual(['update', 'change'])
    expect(validate).toHaveBeenCalledWith('change')
    expect(popup()).toBeNull()
  })
  it('focuses the dialog without a search field and supports Escape there', async () => {
    const w = box({ filterable: false })
    await open(w)
    expect(document.activeElement).toBe(popup())
    popup()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(trigger(w).element)
  })
  it('preserves focus on an outside input when cancelling', async () => {
    const w = box()
    await open(w)
    const outside = document.createElement('input')
    document.body.append(outside)
    outside.focus(); outside.click(); await flushPromises()
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(outside)
  })
  it('clears confirmed values and blocks opening and clearing when disabled', async () => {
    const w = box({ modelValue: ['east'], clearable: true })
    await w.find('.zt-select-box__clear').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[[]]])
    expect(w.emitted('clear')).toEqual([[]])
    await w.setProps({ disabled: true }); await trigger(w).trigger('click')
    expect(popup()).toBeNull()
  })
})

describe('SelectBox paged remote search', () => {
  it('loads the empty keyword immediately, uses server total, and never slices server pages', async () => {
    const remoteMethod = vi.fn().mockResolvedValue({ mode: 'search', options: [...options, { value: 'extra', label: '第三项' }], total: 60 })
    const w = box({ remote: true, remoteMethod, pageSize: 2 })
    expect(remoteMethod).not.toHaveBeenCalled()
    await open(w)
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '', page: 1, pageSize: 2 })
    expect(rows()).toHaveLength(3)
    expect(document.querySelector('.zt-pagination__total')?.textContent).toBe('共 60 条')
    await click('[aria-label="下一页"]')
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '', page: 2, pageSize: 2 })
    expect(rows()).toHaveLength(3)
  })
  it('debounces keyword changes, resets page, and emits search', async () => {
    vi.useFakeTimers()
    const remoteMethod = vi.fn().mockResolvedValue(result('初始'))
    const w = box({ remote: true, remoteMethod, pageSize: 20, debounce: 100 })
    await open(w); await click('[aria-label="下一页"]')
    await search(w, '华'); await search(w, '华东')
    expect(remoteMethod).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(100); await flushPromises()
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '华东', page: 1, pageSize: 20 })
    expect(w.emitted('search')).toEqual([['华'], ['华东']])
    expect(rows()[0]?.textContent).toContain('初始')
  })
  it('runs page-size actions immediately exactly once, emits update, and responds to external sizes', async () => {
    const remoteMethod = vi.fn().mockResolvedValue(result('行', 100))
    const w = box({ remote: true, remoteMethod, pageSize: 20, pageSizes: [10, 20, 50] })
    await open(w); await click('[aria-label="下一页"]')
    await click('.zt-pagination__sizes [role="combobox"]')
    const choice = [...document.querySelectorAll('[role="option"]')].find(el => el.textContent?.trim() === '50 条/页') as HTMLElement
    choice.click(); await flushPromises()
    expect(remoteMethod).toHaveBeenCalledTimes(3)
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '', page: 1, pageSize: 50 })
    expect(w.emitted('update:pageSize')).toEqual([[50]])
    await w.setProps({ pageSize: 10 }); await flushPromises()
    expect(remoteMethod).toHaveBeenCalledTimes(4)
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '', page: 1, pageSize: 10 })
    expect(w.emitted('update:pageSize')).toEqual([[50]])
  })
  it('ignores stale responses and preserves the successful page and cache on errors', async () => {
    const old = deferred(); const latest = deferred()
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('成功')).mockImplementationOnce(() => old.promise).mockImplementationOnce(() => latest.promise).mockRejectedValueOnce(new Error('offline'))
    const w = box({ remote: true, remoteMethod, pageSize: 20, modelValue: ['成功'] })
    await open(w); await click('[aria-label="下一页"]'); await click('[aria-label="下一页"]')
    latest.resolve(result('最新')); await flushPromises()
    old.resolve(result('过期')); await flushPromises()
    expect(rows()[0]?.textContent).toContain('最新')
    await click('[aria-label="上一页"]')
    expect(w.findComponent(SelectBoxPanel).props('options')).toEqual([{ value: '最新', label: '最新' }])
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('加载失败')
    expect(w.emitted('remote-error')).toHaveLength(1)
    expect(w.find('.zt-select-box__summary').text()).toBe('成功')
  })
  it.each([NaN, Infinity, -4])('normalizes invalid total %s to zero', async total => {
    const w = box({ remote: true, remoteMethod: vi.fn().mockResolvedValue(result('行', total)) })
    await open(w)
    expect(document.querySelector('.zt-pagination__total')?.textContent).toBe('共 0 条')
  })
  it('corrects an out-of-range page with one immediate re-request', async () => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('第一', 100)).mockResolvedValueOnce(result('无效', 21)).mockResolvedValueOnce(result('末页', 21))
    const w = box({ remote: true, remoteMethod, pageSize: 20 })
    await open(w); await click('[aria-label="第 5 页"]')
    expect(remoteMethod.mock.calls.map(call => call[0].page)).toEqual([1, 5, 2])
    expect(rows()[0]?.textContent).toContain('末页')
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('2')
  })
  it('rejects batch-mode results without replacing a successful search page', async () => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('保留')).mockResolvedValueOnce({ mode: 'batch', matches: [] })
    const w = box({ remote: true, remoteMethod, pageSize: 20 })
    await open(w); await click('[aria-label="下一页"]')
    expect(w.findComponent(SelectBoxPanel).props('options')).toEqual([{ value: '保留', label: '保留' }])
    expect(w.emitted('remote-error')).toHaveLength(1)
  })
  it('limits correction to one re-request even when the corrected response shrinks again', async () => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('第一', 100)).mockResolvedValueOnce(result('无效', 21)).mockResolvedValue(result('变动', 0))
    const w = box({ remote: true, remoteMethod, pageSize: 20 })
    await open(w); await click('[aria-label="第 5 页"]')
    expect(remoteMethod.mock.calls.map(call => call[0].page)).toEqual([1, 5, 2])
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('1')
  })
  it('invalidates pending requests when closed and reloads on reopen', async () => {
    const pending = deferred()
    const remoteMethod = vi.fn().mockImplementationOnce(() => pending.promise).mockResolvedValueOnce(result('重新加载'))
    const w = box({ remote: true, remoteMethod })
    await open(w)
    await click('.zt-select-box-panel__cancel')
    pending.resolve(result('已关闭')); await flushPromises()
    expect(popup()).toBeNull()
    await open(w)
    expect(rows()[0]?.textContent).toContain('重新加载')
    expect(remoteMethod).toHaveBeenCalledTimes(2)
  })
  it('keeps confirmed labels across pages and shows selected values without server pagination', async () => {
    const remoteMethod = vi.fn().mockResolvedValueOnce({ mode: 'search', options, total: 60 }).mockResolvedValueOnce(result('别页'))
    const w = box({ remote: true, remoteMethod, options: [], modelValue: ['east'], pageSize: 20 })
    await open(w); await click('[aria-label="下一页"]'); await click('.zt-select-box-panel__view-selected')
    expect(rows()[0]?.textContent).toContain('华东')
    expect(remoteMethod).toHaveBeenCalledTimes(2)
    await click('.zt-select-box-panel__confirm')
    expect(w.find('.zt-select-box__summary').text()).toBe('华东')
  })
})
