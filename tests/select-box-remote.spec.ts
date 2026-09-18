import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, h, ref } from 'vue'
import { ZtMessage } from '@ztechjs/zt-alert'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import ZtModal from '../src/components/modal/ZtModal.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import { ztFormItemKey } from '../src/components/form/context'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteResult } from '../src/components/select-box/types'

vi.mock('@ztechjs/zt-alert', () => ({ ZtMessage: { success: vi.fn(), warning: vi.fn(), info: vi.fn(), error: vi.fn() } }))

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
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); vi.useRealTimers(); vi.clearAllMocks(); document.body.innerHTML = '' })

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


describe('SelectBox in elevated modal overlays', () => {
  async function modalBox() {
    const modal = mount(ZtModal, {
      attachTo: document.body,
      props: { modelValue: true, zIndex: 3000, showHeader: false },
      slots: { default: () => [h(ZtSelectBox, { options }), h('button', { class: 'after-select-box' }, '后续操作')] },
    })
    wrappers.push(modal)
    await flushPromises()
    const selectBox = modal.findComponent(ZtSelectBox)
    await open(selectBox)
    return selectBox
  }
  it('traverses panel controls with Tab while retaining its pending selection before returning to the modal', async () => {
    const w = await modalBox()
    await click('.zt-select-box-panel__option')
    const searchElement = document.querySelector<HTMLInputElement>('input[aria-label="搜索选项"]')!
    searchElement.focus()
    function tab() { document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })) }
    tab(); await flushPromises()
    expect(document.querySelector('.zt-select-box__popup')).not.toBeNull()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('列表全选')
    expect(rows()[0]?.getAttribute('aria-checked')).toBe('true')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    tab(); await flushPromises()
    expect(document.activeElement?.classList.contains('zt-select-box-panel__view-selected')).toBe(true)
    const confirm = document.querySelector<HTMLElement>('.zt-select-box-panel__confirm')!
    confirm.focus(); tab(); await flushPromises()
    expect(document.activeElement?.classList.contains('after-select-box')).toBe(true)
    expect(document.querySelector('.zt-select-box__popup')).toBeNull()
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
  it.each(['sizes', 'separator'])('places nested %s Select above the modal and SelectBox popup', async mode => {
    await modalBox()
    if (mode === 'separator') await click('.zt-select-box-panel__mode')
    await click(mode === 'sizes' ? '.zt-pagination__sizes [role="combobox"]' : '.zt-select-box-panel__separator [role="combobox"]')
    const modal = document.querySelector<HTMLElement>('.zt-modal')!
    const selectBox = document.querySelector<HTMLElement>('.zt-select-box__popup')!
    const nested = document.querySelector<HTMLElement>('[role="listbox"]')!
    expect(Number(selectBox.style.zIndex)).toBeGreaterThan(Number(modal.style.zIndex))
    expect(Number(nested.style.zIndex)).toBeGreaterThan(Number(selectBox.style.zIndex))
  })
})


async function enterPaste(w: VueWrapper, text: string) {
  await click('.zt-select-box-panel__mode')
  await w.findComponent(SelectBoxPanel).find('textarea').setValue(text)
}
const batch = (matches: { keyword: string; option: { value: string; label: string; disabled?: boolean } }[]): ZtSelectBoxRemoteResult => ({ mode: 'batch', matches })
const eastMatch = { keyword: '华东', option: options[0]! }
const southMatch = { keyword: '华南', option: options[1]! }

describe('SelectBox batch confirmation', () => {
  it('keeps focused confirmation inside the panel while batch loading disables the button', async () => {
    const pending = deferred()
    const w = box({ remote: true, remoteMethod: vi.fn().mockResolvedValueOnce(result('页面')).mockImplementationOnce(() => pending.promise) })
    await open(w); await enterPaste(w, '华东\n华南')
    const confirm = document.querySelector<HTMLButtonElement>('.zt-select-box-panel__confirm')!
    confirm.focus()
    await click('.zt-select-box-panel__confirm')
    expect(confirm.disabled).toBe(true)
    expect(document.activeElement).not.toBe(confirm)
    expect(popup()?.contains(document.activeElement)).toBe(true)
    expect(w.emitted('update:modelValue')).toBeUndefined()
    pending.resolve(batch([eastMatch, southMatch])); await flushPromises()
    expect(w.emitted('update:modelValue')).toEqual([[['east', 'south']]])
    expect(ZtMessage.success).toHaveBeenCalledWith('批量粘贴 2 项，匹配 2 项，已自动勾选 2 项')
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(trigger(w).element)
  })

  it('allows genuine outside focus to cancel a pending batch without restoring it later', async () => {
    const pending = deferred()
    const w = box({ remote: true, remoteMethod: vi.fn().mockResolvedValueOnce(result('页面')).mockImplementationOnce(() => pending.promise) })
    const outside = document.createElement('input')
    document.body.append(outside)
    await open(w); await enterPaste(w, '华东')
    document.querySelector<HTMLButtonElement>('.zt-select-box-panel__confirm')!.focus()
    await click('.zt-select-box-panel__confirm')
    outside.focus(); await flushPromises()
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(outside)
    pending.resolve(batch([eastMatch])); await flushPromises()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(ZtMessage.success).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(outside)
  })

  it.each([false, true])('commits full matches with identical feedback (remote=%s)', async remote => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('搜索页')).mockResolvedValueOnce(batch([eastMatch, southMatch]))
    const w = box({ remote, remoteMethod })
    await open(w); await enterPaste(w, ' 华东\n华南 '); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east', 'south']]])
    expect(ZtMessage.success).toHaveBeenCalledWith('批量粘贴 2 项，匹配 2 项，已自动勾选 2 项')
    expect(popup()).toBeNull()
  })
  it.each([false, true])('commits partial matches and retained draft without blocking (remote=%s)', async remote => {
    const remoteMethod = vi.fn().mockResolvedValueOnce({ mode: 'search', options: [{ value: 'draft', label: '草稿' }], total: 1 }).mockResolvedValueOnce(batch([eastMatch, southMatch]))
    const w = box({ remote, remoteMethod, modelValue: ['confirmed'], options: [...options, { value: 'draft', label: '草稿' }] })
    await open(w)
    if (remote) await click('.zt-select-box-panel__option')
    else await w.findComponent(SelectBoxPanel).findAll('.zt-select-box-panel__option')[2]!.trigger('click')
    await enterPaste(w, '华东\n华南\n不存在'); await click('.zt-select-box-panel__confirm')
    if (remote) expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'batch', keywords: ['华东', '华南', '不存在'] })
    expect(w.emitted('update:modelValue')).toEqual([[['confirmed', 'draft', 'east', 'south']]])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 3 项，匹配 2 项，已自动勾选 2 项')
    expect(popup()).toBeNull()
  })
  it.each([false, true])('commits existing values with warning for zero matches (remote=%s)', async remote => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('搜索页')).mockResolvedValueOnce(batch([]))
    const w = box({ remote, remoteMethod, modelValue: ['east'] })
    await open(w); await enterPaste(w, '不存在'); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east']]])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 1 项，匹配 0 项，已自动勾选 0 项')
    expect(popup()).toBeNull()
  })
  it.each([false, true])('commits empty paste with info and no batch request (remote=%s)', async remote => {
    const remoteMethod = vi.fn().mockResolvedValue(result('搜索页'))
    const w = box({ remote, remoteMethod, modelValue: ['east'] })
    await open(w); await enterPaste(w, ' \n\t '); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east']]])
    expect(ZtMessage.info).toHaveBeenCalledWith('没有可匹配的粘贴内容')
    expect(remoteMethod).toHaveBeenCalledTimes(remote ? 1 : 0)
  })
  it('deduplicates tokens and values, counts keywords, excludes disabled and unsolicited results, and caches matched labels', async () => {
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('搜索页')).mockResolvedValueOnce(batch([
      eastMatch, eastMatch, { keyword: '华东', option: { value: 'east2', label: '第二华东' } },
      { keyword: 'east', option: options[0]! }, { keyword: '禁用', option: { value: 'disabled', label: '禁用', disabled: true } },
      { keyword: '未请求', option: { value: 'rogue', label: '错误结果' } },
    ]))
    const w = box({ remote: true, remoteMethod, options: [], modelValue: ['east'] })
    await open(w); await enterPaste(w, '华东\neast\n华东\n禁用'); await click('.zt-select-box-panel__confirm')
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'batch', keywords: ['华东', 'east', '禁用'] })
    expect(w.emitted('update:modelValue')).toEqual([[['east', 'east2']]])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 4 项（去重后 3 项），匹配 2 项，已自动勾选 1 项')
    await w.setProps({ modelValue: ['east', 'east2'] })
    expect(w.find('.zt-select-box__summary').text()).toBe('华东, 第二华东')
  })
  it('matches local options beyond the filtered page, with duplicate and disabled counting', async () => {
    const w = box({ pageSize: 1, modelValue: ['east'], options: [...options, { value: 'east2', label: '华东' }, { value: 'disabled', label: '禁用', disabled: true }] })
    await open(w); await search(w, '华南'); await enterPaste(w, '华东\neast\n华东\n禁用'); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east', 'east2']]])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 4 项（去重后 3 项），匹配 2 项，已自动勾选 1 项')
  })
  it('keeps batch loading independent from search results and suppresses duplicate clicks', async () => {
    const pending = deferred(); const pageRequest = deferred()
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('原页面')).mockImplementationOnce(() => pageRequest.promise).mockImplementationOnce(() => pending.promise)
    const w = box({ remote: true, remoteMethod })
    await open(w); await click('[aria-label="下一页"]'); await enterPaste(w, '华东')
    const confirm = document.querySelector<HTMLButtonElement>('.zt-select-box-panel__confirm')!
    confirm.click(); confirm.click(); await flushPromises()
    expect(remoteMethod).toHaveBeenCalledTimes(3)
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'batch', keywords: ['华东'] })
    expect(confirm.textContent).toContain('匹配中')
    expect(confirm.disabled).toBe(true)
    expect(w.findComponent(SelectBoxPanel).find('textarea').attributes('disabled')).toBeDefined()
    expect(w.findComponent(SelectBoxPanel).props('loading')).toBe(true)
    pageRequest.resolve(result('新页面')); await flushPromises()
    expect(w.findComponent(SelectBoxPanel).props('loading')).toBe(false)
    expect(w.findComponent(SelectBoxPanel).props('batchLoading')).toBe(true)
    expect(w.findComponent(SelectBoxPanel).props('options')).toEqual([{ value: '新页面', label: '新页面' }])
    pending.resolve(batch([eastMatch])); await flushPromises()
    expect(w.emitted('update:modelValue')).toEqual([[['east']]])
  })
  it('does not cancel batch when a debounced search starts later', async () => {
    vi.useFakeTimers()
    const pending = deferred(); const searchPending = deferred()
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('原页面')).mockImplementationOnce(() => pending.promise).mockImplementationOnce(() => searchPending.promise)
    const w = box({ remote: true, remoteMethod, debounce: 100 })
    await open(w); await search(w, '新搜索'); await enterPaste(w, '华东'); await click('.zt-select-box-panel__confirm')
    await vi.advanceTimersByTimeAsync(100); await flushPromises()
    expect(remoteMethod).toHaveBeenLastCalledWith({ mode: 'search', keyword: '新搜索', page: 1, pageSize: 10 })
    pending.resolve(batch([eastMatch])); await flushPromises()
    expect(w.emitted('update:modelValue')).toEqual([[['east']]])
    searchPending.resolve(result('迟到搜索')); await flushPromises()
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })
  it.each(['cancel', 'disable', 'method', 'unmount'])('ignores stale batch completion after %s', async action => {
    const pending = deferred()
    const remoteMethod = vi.fn().mockResolvedValueOnce(result('原页面')).mockImplementationOnce(() => pending.promise).mockResolvedValue(result('重开'))
    const w = box({ remote: true, remoteMethod })
    await open(w); await enterPaste(w, '华东'); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    if (action === 'cancel') { await click('.zt-select-box-panel__cancel'); await open(w) }
    if (action === 'disable') await w.setProps({ disabled: true })
    if (action === 'method') await w.setProps({ remoteMethod: vi.fn().mockResolvedValue(result('新方法')) })
    if (action === 'unmount') w.unmount()
    pending.resolve(batch([eastMatch])); await flushPromises()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(ZtMessage.success).not.toHaveBeenCalled()
    expect(ZtMessage.warning).not.toHaveBeenCalled()
    if (action === 'cancel' || action === 'method') expect(w.findComponent(SelectBoxPanel).props('batchLoading')).toBe(false)
  })
  it('ignores a stale batch rejection after closing', async () => {
    const pending = deferred()
    const w = box({ remote: true, remoteMethod: vi.fn().mockResolvedValueOnce(result('页面')).mockImplementationOnce(() => pending.promise) })
    await open(w); await enterPaste(w, '华东'); await click('.zt-select-box-panel__confirm'); await click('.zt-select-box-panel__cancel')
    pending.reject(new Error('late failure')); await flushPromises()
    expect(w.emitted('remote-error')).toBeUndefined()
    expect(ZtMessage.error).not.toHaveBeenCalled()
  })
  it.each(['rejection', 'wrong mode'])('preserves input and draft on %s and supports retry', async failure => {
    const reason = new Error('offline')
    const remoteMethod = vi.fn().mockResolvedValueOnce({ mode: 'search', options, total: 2 })
    if (failure === 'rejection') remoteMethod.mockRejectedValueOnce(reason)
    else remoteMethod.mockResolvedValueOnce(result('错误响应'))
    remoteMethod.mockResolvedValueOnce(batch([southMatch]))
    const w = box({ remote: true, remoteMethod })
    await open(w); await click('.zt-select-box-panel__option'); await enterPaste(w, '华南'); await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('remote-error')).toHaveLength(1)
    expect(ZtMessage.error).toHaveBeenCalledWith('批量匹配失败，请重试')
    expect(w.findComponent(SelectBoxPanel).find('textarea').element.value).toBe('华南')
    expect(w.findComponent(SelectBoxPanel).props('batchLoading')).toBe(false)
    expect(w.findComponent(SelectBoxPanel).props('failed')).toBe(false)
    expect(w.findComponent(SelectBoxPanel).props('options')).toEqual(options)
    await click('.zt-select-box-panel__confirm')
    expect(w.emitted('update:modelValue')).toEqual([[['east', 'south']]])
    expect(ZtMessage.success).toHaveBeenCalledWith('批量粘贴 1 项，匹配 1 项，已自动勾选 1 项')
    expect(popup()).toBeNull()
  })
})
