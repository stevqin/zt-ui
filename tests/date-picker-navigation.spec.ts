import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
async function click(label: string) {
  const button = [...document.querySelectorAll<HTMLButtonElement>('button')].find(el => el.getAttribute('aria-label') === label)
  expect(button, label).toBeDefined()
  button!.focus(); button!.click(); await nextTick(); await nextTick()
}
describe.each([ZtDatePicker, ZtDateTimePicker])('custom year and month navigation', component => {
  async function open(modelValue = component === ZtDatePicker ? '2024-02-15' : '2024-02-15 09:00:00') {
    const wrapper = mount(component, { attachTo: document.body, props: { modelValue } })
    wrappers.push(wrapper)
    await wrapper.get('input').trigger('click')
    return wrapper
  }
  it('uses custom grids and only commits after picking a date', async () => {
    const wrapper = await open()
    expect(document.querySelector('.zt-date-picker__header select')).toBeNull()
    expect(document.querySelector('.zt-date-picker__header input')).toBeNull()
    await click('选择年份')
    expect(document.querySelectorAll('[data-year]')).toHaveLength(12)
    await click('2030年')
    expect(document.querySelectorAll('[data-month]')).toHaveLength(12)
    await click('3月')
    expect(document.querySelector('[data-date="2030-03-01"]')).not.toBeNull()
    expect(wrapper.emitted('change')).toBeUndefined()
    await click('2030-03-12')
    if (component === ZtDateTimePicker) {
      document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.click(); await nextTick()
    }
    expect(wrapper.emitted('change')).toEqual([[component === ZtDatePicker ? '2030-03-12' : '2030-03-12 09:00:00']])
  })
  it('pages years by decade and supports direct month selection', async () => {
    const wrapper = await open()
    await click('选择年份'); await click('后十年')
    expect(document.querySelector('[data-year="2035"]')).not.toBeNull()
    await click('2035年'); await click('12月')
    await click('选择月份'); await click('1月')
    expect(document.querySelector('[data-date="2035-01-01"]')).not.toBeNull()
    expect(wrapper.emitted('change')).toBeUndefined()
  })
  it('moves keyboard focus in a three-column month grid', async () => {
    await open(); await click('选择月份')
    expect((document.activeElement as HTMLElement).dataset.month).toBe('1')
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    await nextTick()
    expect((document.activeElement as HTMLElement).dataset.month).toBe('4')
  })
  it('prevents browsing outside years 1 to 9999', async () => {
    await open(component === ZtDatePicker ? '0001-01-01' : '0001-01-01 00:00:00')
    expect(document.querySelector<HTMLButtonElement>('[aria-label="上个月"]')?.disabled).toBe(true)
    await click('选择年份')
    expect(document.querySelector<HTMLButtonElement>('[aria-label="前十年"]')?.disabled).toBe(true)
    expect(document.querySelector<HTMLButtonElement>('[data-year="0"]')?.disabled).toBe(true)
  })
})

it('keeps the calendar open when navigation replaces the clicked element before document click handling', async () => {
  const wrapper = mount(ZtDatePicker, { attachTo: document.body, props: { modelValue: '2024-02-15' } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  const yearButton = document.querySelector<HTMLButtonElement>('[aria-label="选择年份"]')!
  // Browsers can flush the view change before the document receives this click.
  yearButton.addEventListener('click', event => {
    // happy-dom recomputes the path; real browsers retain its dispatch-time path.
    const path = event.composedPath()
    Object.defineProperty(event, 'composedPath', { value: () => path })
    yearButton.remove()
  })
  yearButton.click(); await nextTick(); await nextTick()
  expect(document.querySelectorAll('[data-year]')).toHaveLength(12)
})

it('retains focus within the popup when removing a focused year during selection', async () => {
  const wrapper = mount(ZtDatePicker, { attachTo: document.body, props: { modelValue: '2024-02-15' } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  await click('选择年份')
  const year = document.querySelector<HTMLButtonElement>('[data-year="2025"]')!
  year.addEventListener('click', () => year.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null, bubbles: true })))
  year.click(); await nextTick(); await nextTick()
  expect(document.querySelectorAll('[data-month]')).toHaveLength(12)
})

it('keeps navigation available after choosing a month with no enabled days', async () => {
  const wrapper = mount(ZtDatePicker, { attachTo: document.body, props: { modelValue: '2024-02-15', disabledDate: () => true } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  await click('选择月份'); await click('3月')
  expect(document.activeElement?.getAttribute('aria-label')).toBe('选择年份')
  expect(document.querySelector('.zt-date-picker__panel')).not.toBeNull()
})

it('restores grid focus after a pointer click pages away from the focused year', async () => {
  const wrapper = mount(ZtDatePicker, { attachTo: document.body, props: { modelValue: '2024-02-15' } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  await click('选择年份')
  // Mousedown is prevented by the popup, so focus stays on the current year.
  document.querySelector<HTMLButtonElement>('[aria-label="后十年"]')!.click()
  await nextTick(); await nextTick()
  expect((document.activeElement as HTMLElement).dataset.year).toBe('2034')
})
