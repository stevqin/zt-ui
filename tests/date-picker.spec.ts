import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as library from '../src'

const wrappers: VueWrapper[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
async function picker(datetime = false, props: Record<string, unknown> = {}) {
  const component = library[datetime ? 'ZtDateTimePicker' : 'ZtDatePicker']
  expect(component, 'date picker is publicly exported').toBeDefined()
  const wrapper = mount(component, { attachTo: document.body, props: { modelValue: datetime ? '2024-02-15 12:30:45' : '2024-02-15', ...props } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  return wrapper
}
async function day(value: string) {
  const button = document.querySelector<HTMLButtonElement>(`[data-date="${value}"]`)!
  expect(button).not.toBeNull()
  button.click()
  await nextTick()
}
describe('date pickers', () => {
  it('shows the current draft and applies the default range shortcuts', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 19, 14, 35, 42))
    const wrapper = await picker(false, { range: true, modelValue: ['2026-09-01', '2026-09-02'] })
    expect(document.querySelector('.zt-date-picker__summary')?.textContent).toContain('2026-09-01 至 2026-09-02')
    expect([...document.querySelectorAll<HTMLButtonElement>('[data-shortcut]')].map(button => button.textContent)).toEqual(['今日', '本周', '上月'])
    document.querySelector<HTMLButtonElement>('[data-shortcut="本周"]')!.click()
    await nextTick()
    expect(wrapper.emitted('change')).toEqual([[['2026-09-14', '2026-09-20']]])
    vi.useRealTimers()
  })

  it('supports custom shortcuts and current-time defaults', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 19, 14, 35, 42))
    const custom = await picker(false, { shortcuts: [{ label: '财年开始', value: '2026-01-01' }] })
    expect(document.querySelector('.zt-date-picker__summary')?.textContent).toContain('2024-02-15')
    expect([...document.querySelectorAll<HTMLButtonElement>('[data-shortcut]')].map(button => button.textContent)).toEqual(['财年开始'])
    document.querySelector<HTMLButtonElement>('[data-shortcut="财年开始"]')!.click()
    await nextTick()
    expect(custom.emitted('change')).toEqual([['2026-01-01']])

    const datetime = await picker(true)
    expect([...document.querySelectorAll<HTMLButtonElement>('[data-shortcut]')].map(button => button.textContent)).toContain('现在')
    document.querySelector<HTMLButtonElement>('[data-shortcut="现在"]')!.click()
    await nextTick()
    expect(datetime.emitted('change')).toBeUndefined()
    document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.click()
    await nextTick()
    expect(datetime.emitted('change')).toEqual([['2026-09-19 14:35:42']])
    vi.useRealTimers()
  })

  it('recomputes the default shortcut when a later opening crosses midnight', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 19, 23, 59, 58))
    const wrapper = await picker(false)
    await wrapper.get('input').trigger('click')
    vi.setSystemTime(new Date(2026, 8, 20, 0, 0, 2))
    await wrapper.get('input').trigger('click')
    document.querySelector<HTMLButtonElement>('[data-shortcut="今日"]')!.click()
    await nextTick()
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['2026-09-20'])
    vi.useRealTimers()
  })

  it.each([
    ['daterange', ['2026-09-20', '2026-09-10'], ['2026-09-10', '2026-09-20']],
    ['monthrange', ['2026-09', '2026-03'], ['2026-03', '2026-09']],
    ['yearrange', ['2028', '2024'], ['2024', '2028']],
  ])('orders a reversed custom %s shortcut', async (type, value, expected) => {
    const wrapper = await picker(false, {
      type,
      modelValue: expected,
      shortcuts: [{ label: '反向范围', value }],
    })
    document.querySelector<HTMLButtonElement>('[data-shortcut="反向范围"]')!.click()
    await nextTick()
    expect(wrapper.emitted('change')).toEqual([[expected]])
  })

  it('selects leap day and closes the calendar', async () => {
    const wrapper = await picker()
    await day('2024-02-29')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2024-02-29']])
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
  it('orders a reverse-selected range and emits only when complete', async () => {
    const wrapper = await picker(false, { range: true, modelValue: ['2024-02-05', '2024-02-15'] })
    await day('2024-02-20')
    expect(wrapper.emitted('change')).toBeUndefined()
    await day('2024-02-10')
    expect(wrapper.emitted('change')).toEqual([[['2024-02-10', '2024-02-20']]])
  })
  it('supports ranges across months', async () => {
    const wrapper = await picker(false, { range: true, modelValue: ['2024-02-05', '2024-02-15'] })
    await day('2024-02-29')
    document.querySelector<HTMLButtonElement>('[aria-label="下个月"]')!.click()
    await nextTick()
    await day('2024-03-05')
    expect(wrapper.emitted('change')).toEqual([[['2024-02-29', '2024-03-05']]])
  })
  it('ignores disabled dates', async () => {
    const wrapper = await picker(false, { disabledDate: (date: Date) => date.getDate() === 29 })
    await day('2024-02-29')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
  it('requires confirmation and preserves time when changing date', async () => {
    const wrapper = await picker(true)
    await day('2024-02-29')
    expect(wrapper.emitted('change')).toBeUndefined()
    document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.click()
    await nextTick()
    expect(wrapper.emitted('change')).toEqual([['2024-02-29 12:30:45']])
  })
  it('rejects a same-day datetime range whose end precedes its start', async () => {
    const wrapper = await picker(true, { range: true, modelValue: ['2024-02-15 12:30:00', '2024-02-15 13:00:00'] })
    const end = document.querySelector<HTMLInputElement>('[aria-label="结束时间"]')!
    end.value = '11:00:00'; end.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.disabled).toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
  })
  it('cancels a draft with Escape without changing the value', async () => {
    const wrapper = await picker(true)
    await day('2024-02-29')
    document.querySelector('[role="dialog"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
  it('clears to null and shows a real placeholder', async () => {
    const wrapper = await picker(false, { clearable: true })
    await wrapper.get('[aria-label="清空日期"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.get('input').element.value).toBe('')
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择日期')
  })
  it('does not open while disabled', async () => {
    await picker(false, { disabled: true })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})

describe('date picker integration', () => {
  it.each([false, true])('keeps the %s datetime panel open when clicking calendar whitespace', async datetime => {
    const wrapper = await picker(datetime)
    const input = wrapper.get('input').element as HTMLInputElement
    input.focus()
    const blank = document.querySelector<HTMLElement>('.zt-date-picker__week')!
    const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    blank.dispatchEvent(mouseDown)
    expect(mouseDown.defaultPrevented).toBe(true)
    if (!mouseDown.defaultPrevented) input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
    blank.click()
    await nextTick()
    expect(document.querySelector('.zt-date-picker__panel')).not.toBeNull()
  })

  it('moves across leap day with the keyboard and skips disabled dates', async () => {
    const wrapper = await picker(false, { modelValue: '2024-02-28', disabledDate: (date: Date) => date.getDate() === 29 })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2024-02-28')
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick(); await nextTick()
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2024-03-01')
  })
  it('commits a datetime range with edited start and end times', async () => {
    const wrapper = await picker(true, { range: true, modelValue: ['2024-02-01 09:00:00', '2024-02-02 18:00:00'] })
    await day('2024-02-20'); await day('2024-02-10')
    const time = document.querySelector<HTMLInputElement>('[aria-label="开始时间"]')!
    time.value = '08:15:30'; time.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.click()
    await nextTick()
    expect(wrapper.emitted('change')).toEqual([[['2024-02-10 08:15:30', '2024-02-20 18:00:00']]])
  })
  it('discards an incomplete range on outside click and reflects external changes', async () => {
    const wrapper = await picker(false, { range: true, modelValue: ['2024-02-01', '2024-02-02'] })
    await day('2024-02-15')
    document.body.click(); await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ modelValue: ['2025-01-01', '2025-01-02'] })
    await wrapper.get('input').trigger('click')
    expect(document.querySelector<HTMLButtonElement>('[data-date="2025-01-01"]')?.getAttribute('aria-pressed')).toBe('true')
  })
  it.each(['2023-02-29', '2024-13-01', '2024-04-31', 'not-a-date', ''])('does not display invalid date %s as a selected value', async modelValue => {
    const wrapper = await picker(false, { modelValue })
    expect(wrapper.get('input').element.value).toBe('')
  })
  it('validates the updated form model and inherits size and disabled state', async () => {
    const model = reactive({ date: null as library.ZtDatePickerValue })
    const wrapper = mount(library.ZtForm, {
      attachTo: document.body,
      props: { model, size: 'small', rules: { date: [{ required: true, message: '请选择日期', trigger: 'change' }] } },
      slots: { default: () => h(library.ZtFormItem, { prop: 'date' }, () => h(library.ZtDatePicker, {
        modelValue: model.date, clearable: true, 'onUpdate:modelValue': value => { model.date = value },
      })) },
    })
    wrappers.push(wrapper)
    const child = wrapper.findComponent(library.ZtDatePicker)
    expect(child.find('.zt-date-picker--small').exists()).toBe(true)
    await child.get('input').trigger('click')
    document.querySelector<HTMLButtonElement>('[data-date]:not(:disabled)')!.click()
    await flushPromises()
    expect(wrapper.find('.zt-form-item.is-error').exists()).toBe(false)
    await child.get('[aria-label="清空日期"]').trigger('click')
    await flushPromises()
    expect(document.getElementById(child.get('input').attributes('aria-describedby') || '')?.textContent).toContain('请选择日期')
    await wrapper.setProps({ disabled: true })
    expect(child.get('input').element.disabled).toBe(true)
  })
  it.each([library.ZtModal, library.ZtDrawer])('owns Escape inside an overlay', async component => {
    const wrapper = mount(component, { attachTo: document.body, props: { modelValue: true }, slots: { default: () => h(library.ZtDatePicker) } })
    wrappers.push(wrapper)
    await nextTick()
    const child = wrapper.findComponent(library.ZtDatePicker)
    await child.get('input').trigger('keydown', { key: 'ArrowDown' })
    const panel = document.querySelector('.zt-date-picker__panel')!
    expect(panel).not.toBeNull()
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.querySelector('.zt-date-picker__panel')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

it('closes and emits blur when focus leaves for the document', async () => {
  const wrapper = await picker()
  await wrapper.get('input').trigger('focusout', { relatedTarget: null })
  await nextTick()
  expect(document.querySelector('.zt-date-picker__panel')).toBeNull()
  expect(wrapper.emitted('blur')).toHaveLength(1)
})

it.each([library.ZtModal, library.ZtDrawer])('allows Tab to reach time and confirm inside a parent overlay', async component => {
  const wrapper = mount(component, { attachTo: document.body, props: { modelValue: true }, slots: { default: () => h(library.ZtDateTimePicker, { modelValue: '2024-02-15 12:00:00' }) } })
  wrappers.push(wrapper)
  await nextTick()
  await wrapper.findComponent(library.ZtDateTimePicker).get('input').trigger('keydown', { key: 'ArrowDown' })
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
  await nextTick()
  expect(document.querySelector('.zt-date-picker__panel')).not.toBeNull()
  expect(document.activeElement?.getAttribute('aria-label')).toBe('时间')
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
  await nextTick()
  expect((document.activeElement as HTMLElement).dataset.date).toBe('2024-02-15')
})
