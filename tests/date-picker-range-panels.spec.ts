import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker } from '../src'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
async function click(selector: string) {
  document.querySelector<HTMLButtonElement>(selector)!.click()
  await nextTick(); await nextTick()
}
describe.each([ZtDatePicker, ZtDateTimePicker])('dual range calendars', component => {
  async function open(date = '2024-01-15') {
    const suffix = component === ZtDateTimePicker ? ' 09:00:00' : ''
    const w = mount(component, { attachTo: document.body, props: { range: true, modelValue: [date + suffix, date + suffix] as [string, string] } })
    wrappers.push(w); await w.get('input').trigger('click'); return w
  }
  it('selects endpoints across two months without duplicate date cells', async () => {
    const w = await open()
    expect(document.querySelectorAll('.zt-date-picker__calendar')).toHaveLength(2)
    expect(document.querySelectorAll('[data-date="2024-02-01"]')).toHaveLength(1)
    await click('[data-date="2024-01-30"]')
    document.querySelector('[data-date="2024-02-03"]')!.dispatchEvent(new MouseEvent('mouseenter'))
    await nextTick()
    expect(document.querySelector('[data-date="2024-02-01"]')!.classList.contains('is-in-range')).toBe(true)
    await click('[data-date="2024-02-03"]')
    if (component === ZtDateTimePicker) await click('[data-action="confirm"]')
    expect(w.emitted('change')).toEqual([[component === ZtDatePicker ? ['2024-01-30', '2024-02-03'] : ['2024-01-30 09:00:00', '2024-02-03 09:00:00']]])
  })
  it('links right navigation and custom month selection to consecutive months', async () => {
    await open()
    await click('[data-calendar="1"] [aria-label="下个月"]')
    expect(document.querySelector('[data-calendar="0"] [data-date="2024-02-01"]')).not.toBeNull()
    await click('[data-calendar="1"] [aria-label="选择月份"]')
    await click('[data-calendar="1"] [data-month="11"]')
    expect(document.querySelector('[data-calendar="0"] [data-date="2024-11-01"]')).not.toBeNull()
    expect(document.querySelector('[data-calendar="1"] [data-date="2024-12-01"]')).not.toBeNull()
  })
  it('moves keyboard focus across panels without shifting visible months', async () => {
    await open()
    const day = document.querySelector<HTMLButtonElement>('[data-date="2024-01-31"]')!
    day.focus(); day.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick(); await nextTick()
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2024-02-01')
    expect(document.querySelector('[data-calendar="0"] [data-date="2024-01-01"]')).not.toBeNull()
  })
  it('does not route date keys through the year/month grid handler', async () => {
    await open()
    const day = document.querySelector<HTMLButtonElement>('[data-date="2024-01-15"]')!
    day.focus(); day.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
    await nextTick(); await nextTick()
    expect(document.activeElement).toBe(day)
    expect(document.querySelector('[data-calendar="1"] [data-date="2024-02-01"]')).not.toBeNull()
  })
  it('keeps both panels in supported years at the upper boundary', async () => {
    await open('9999-12-15')
    expect(document.querySelector('[data-calendar="0"] [data-date="9999-11-01"]')).not.toBeNull()
    expect(document.querySelector('[data-calendar="1"] [data-date="9999-12-01"]')).not.toBeNull()
    await click('[data-calendar="0"] [aria-label="下个月"]')
    expect(document.querySelector('[data-calendar="1"] [data-date="9999-12-01"]')).not.toBeNull()
  })
})
