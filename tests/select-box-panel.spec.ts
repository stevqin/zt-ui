import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'
import { ZtMessage } from '@ztechjs/zt-alert'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import ZtCheckbox from '../src/components/checkbox/ZtCheckbox.vue'
import ZtButton from '../src/components/button/ZtButton.vue'
import ZtInput from '../src/components/input/ZtInput.vue'
import ZtPagination from '../src/components/pagination/ZtPagination.vue'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtLoading from '../src/components/loading/ZtLoading.vue'
import ZtScrollbar from '../src/components/scrollbar/ZtScrollbar.vue'
import { overlayContextKey, type OverlayBranch } from '../src/components/overlay/context'
import type { ZtSelectOption } from '../src/components/select-box/types'

vi.mock('@ztechjs/zt-alert', () => ({
  ZtMessage: { success: vi.fn(), warning: vi.fn(), info: vi.fn(), error: vi.fn() },
}))

const options: ZtSelectOption[] = [
  { value: 'east', label: '华东' },
  { value: 'south', label: '华南' },
  { value: 'north', label: '华北', disabled: true },
  { value: 'west', label: '华西' },
  { value: 5, label: '第五项' },
]
const wrappers: VueWrapper[] = []
function panel(props = {}, slots = {}) {
  const wrapper = mount(SelectBoxPanel, {
    attachTo: document.body,
    props: { options, modelValue: [], pageSize: 2, ...props },
    slots,
    global: { stubs: { teleport: true } },
  })
  wrappers.push(wrapper)
  return wrapper
}
afterEach(() => { wrappers.splice(0).forEach(wrapper => wrapper.unmount()); vi.clearAllMocks() })
const rows = (wrapper: VueWrapper) => wrapper.findAll('.zt-select-box-panel__option')
const confirm = (wrapper: VueWrapper) => wrapper.find('.zt-select-box-panel__confirm').trigger('click')
async function paste(wrapper: VueWrapper, text: string, separator?: string) {
  await wrapper.find('.zt-select-box-panel__mode').trigger('click')
  if (separator) {
    await wrapper.find('.zt-select-box-panel__separator [role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]').find(option => option.text() === separator)!.trigger('click')
  }
  await wrapper.find('textarea').setValue(text)
  await confirm(wrapper)
}

describe('SelectBoxPanel local selection', () => {
  it('uses public controls and confines the option slot to content after the checkbox', () => {
    const wrapper = panel({}, { option: ({ option, selected, disabled }: { option: ZtSelectOption; selected: boolean; disabled: boolean }) => h('span', { class: 'custom-option' }, `${option.label}/${selected}/${disabled}`) })
    for (const component of [ZtCheckbox, ZtButton, ZtInput, ZtPagination, ZtLoading, ZtScrollbar]) {
      expect(wrapper.findComponent(component).exists()).toBe(true)
    }
    const row = rows(wrapper)[0]!
    expect(row.element.firstElementChild?.classList.contains('zt-checkbox__input')).toBe(true)
    expect(row.find('.zt-checkbox__label .custom-option').text()).toBe('华东/false/false')
  })

  it('offers the complete default page-size set', async () => {
    const wrapper = panel({ pageSize: 10 })
    await wrapper.find('.zt-pagination__sizes [role="combobox"]').trigger('click')
    expect(wrapper.findAll('[role="option"]').map(option => option.text())).toEqual([
      '10 条/页',
      '20 条/页',
      '50 条/页',
      '100 条/页',
      '200 条/页',
      '500 条/页',
    ])
  })

  it.each(['.zt-checkbox__input', '.zt-checkbox__inner', 'input', '.zt-checkbox__label', '.custom-option', 'row'])('toggles once per click on %s', async target => {
    const wrapper = panel({}, { option: ({ option }: { option: ZtSelectOption }) => h('span', { class: 'custom-option' }, option.label) })
    const row = rows(wrapper)[0]!
    const element = (target === 'row' ? row : row.find(target)).element as HTMLElement
    element.click()
    await wrapper.vm.$nextTick()
    expect(row.attributes('aria-checked')).toBe('true')
    element.click()
    await wrapper.vm.$nextTick()
    expect(row.attributes('aria-checked')).toBe('false')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual([])
  })

  it('keeps internal blank clicks in the panel and leaves drafts uncommitted', async () => {
    const wrapper = panel()
    await rows(wrapper)[0]!.trigger('click')
    await wrapper.find('.zt-select-box-panel__footer').trigger('click')
    await wrapper.trigger('click')
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(rows(wrapper)[0]!.attributes('aria-checked')).toBe('true')
  })

  it('selects only enabled items on the current page and retains selections across pages', async () => {
    const wrapper = panel()
    await wrapper.find('[aria-label="列表全选"]').trigger('click')
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(rows(wrapper).map(row => row.text())).toEqual(['华北', '华西'])
    await wrapper.find('[aria-label="列表全选"]').trigger('click')
    expect(rows(wrapper)[0]!.attributes('aria-checked')).toBe('false')
    expect(wrapper.emitted('update:page')).toEqual([[2]])
    await wrapper.find('[aria-label="上一页"]').trigger('click')
    expect(rows(wrapper).every(row => row.attributes('aria-checked') === 'true')).toBe(true)
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['east', 'south', 'west'])
  })

  it('announces content changes for placement when paging and switching modes', async () => {
    const wrapper = panel()
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('resize')?.length).toBeGreaterThan(0)
    const updates = wrapper.emitted('resize')!.length
    await wrapper.find('.zt-select-box-panel__mode').trigger('click')
    expect(wrapper.emitted('resize')!.length).toBeGreaterThan(updates)
  })

  it('filters before paginating and resets the page for search and page-size changes', async () => {
    const wrapper = panel({ pageSizes: [2, 4] })
    await wrapper.find('[aria-label="第 3 页"]').trigger('click')
    await wrapper.find('input[aria-label="搜索选项"]').setValue('华')
    expect(wrapper.emitted('search')).toEqual([['华']])
    expect(wrapper.find('.zt-pagination__total').text()).toBe('共 4 条')
    expect(rows(wrapper).map(row => row.text())).toEqual(['华东', '华南'])
    await wrapper.find('[aria-label="下一页"]').trigger('click')
    await wrapper.find('.zt-pagination__sizes [role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]').find(option => option.text() === '4 条/页')!.trigger('click')
    expect(wrapper.emitted('update:pageSize')).toEqual([[4]])
    expect(rows(wrapper)).toHaveLength(4)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('1')
  })

  it('shows selected options across pages including cached values, and synchronizes model changes', async () => {
    const wrapper = panel({ modelValue: ['west', 'unknown'], knownOptions: [{ value: 'unknown', label: '旧选项' }] })
    await wrapper.find('.zt-select-box-panel__view-selected').trigger('click')
    expect(rows(wrapper).map(row => row.text())).toEqual(['华西', '旧选项'])
    await wrapper.setProps({ modelValue: [] })
    expect(rows(wrapper)).toHaveLength(0)
  })

  it('blocks disabled option and panel interaction but allows cancel', async () => {
    const wrapper = panel({ pageSize: 10 })
    await rows(wrapper)[2]!.trigger('click')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual([])
    await wrapper.setProps({ disabled: true })
    await rows(wrapper)[0]!.trigger('click')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    await wrapper.find('.zt-select-box-panel__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toEqual([[]])
  })

  it.each(['search', 'paste'])('preserves the draft for a composing Escape from %s input', async mode => {
    const wrapper = panel()
    await rows(wrapper)[0]!.trigger('click')
    if (mode === 'paste') await wrapper.find('.zt-select-box-panel__mode').trigger('click')
    const input = wrapper.find(mode === 'paste' ? 'textarea' : 'input[aria-label="搜索选项"]')
    await input.trigger('keydown', { key: 'Escape', isComposing: true })
    expect(wrapper.emitted('cancel')).toBeUndefined()
    if (mode === 'paste') await wrapper.find('.zt-select-box-panel__mode').trigger('click')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['east'])
  })

  it.each(['search', 'paste'])('cancels and discards the draft for ordinary Escape from %s input', async mode => {
    const wrapper = panel()
    await rows(wrapper)[0]!.trigger('click')
    if (mode === 'paste') await wrapper.find('.zt-select-box-panel__mode').trigger('click')
    const input = wrapper.find(mode === 'paste' ? 'textarea' : 'input[aria-label="搜索选项"]')
    await input.trigger('keydown', { key: 'Escape', isComposing: false })
    expect(wrapper.emitted('cancel')).toEqual([[]])
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('supports Space and Enter selection and Escape cancellation', async () => {
    const wrapper = panel()
    await rows(wrapper)[0]!.trigger('keydown', { key: ' ' })
    await rows(wrapper)[1]!.trigger('keydown', { key: 'Enter' })
    expect(rows(wrapper).every(row => row.attributes('aria-checked') === 'true')).toBe(true)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toEqual([[]])
  })
})

describe('SelectBoxPanel local batch matching', () => {
  it.each([
    [' 华东 \n华西\r\n5\n华东\n ', undefined],
    [' 华东 ,华西，5,华东, ', '逗号(,)'],
    [' 华东 ;华西；5;华东; ', '分号(;)'],
    [' 华东 \t华西\t5\t华东\t ', '制表符(\\t)'],
  ])('parses the selected delimiter, trims and deduplicates %s', async (text, separator) => {
    const wrapper = panel()
    await wrapper.find('input[aria-label="搜索选项"]').setValue('华东')
    await paste(wrapper, text, separator)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(rows(wrapper).map(row => row.text())).toEqual(['华东', '华西', '第五项'])
    expect(wrapper.find('.zt-select-box-panel__pager').exists()).toBe(false)
    expect(ZtMessage.success).toHaveBeenCalledWith('批量粘贴 4 项（去重后 3 项），匹配 3 项，已自动勾选 3 项')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['east', 'west', 5])
  })

  it('reviews partial matches while excluding disabled and inexact matches', async () => {
    const wrapper = panel({ modelValue: ['south'] })
    await paste(wrapper, '华东\n华北\n华\nEAST')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(rows(wrapper).map(row => row.text())).toEqual(['华南', '华东'])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 4 项，匹配 1 项，已自动勾选 1 项')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['south', 'east'])
  })

  it('keeps the existing draft for review when nothing matches', async () => {
    const wrapper = panel({ modelValue: ['west'] })
    await paste(wrapper, '不存在')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(rows(wrapper).map(row => row.text())).toEqual(['华西'])
    expect(ZtMessage.warning).toHaveBeenCalledWith('批量粘贴 1 项，匹配 0 项，已自动勾选 0 项')
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['west'])
  })

  it('selects every enabled exact match and counts unique keywords separately from newly selected values', async () => {
    const wrapper = panel({ modelValue: ['east'], options: [...options, { value: 'other', label: '华东' }, { value: 'east', label: '别名' }] })
    await paste(wrapper, '华东\neast\n别名')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    await confirm(wrapper)
    expect(wrapper.emitted('confirm')?.[0]?.[0]).toEqual(['east', 'other'])
  })

  it('registers the separator Select popup in the containing overlay', async () => {
    const branches: OverlayBranch[] = []
    const wrapper = mount(SelectBoxPanel, {
      props: { modelValue: [], options },
      global: { provide: { [overlayContextKey as symbol]: { interactive: ref(true), registerBranch: (branch: OverlayBranch) => { branches.push(branch); return () => { branches.splice(branches.indexOf(branch), 1) } } } }, stubs: { teleport: true } },
    })
    wrappers.push(wrapper)
    await wrapper.find('.zt-select-box-panel__mode').trigger('click')
    expect(wrapper.findComponent(ZtSelect).exists()).toBe(true)
    await wrapper.find('[role="combobox"]').trigger('click')
    expect(branches.some(branch => branch.visible.value && branch.popup.value?.getAttribute('role') === 'listbox')).toBe(true)
  })
})
