import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, expect, it } from 'vitest'
import { ZtDatePicker, ZtDatePickerPanel } from '../src'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
async function open(type: string, modelValue: any, extra = {}) {
  const w = mount(ZtDatePicker, { attachTo: document.body, props: { type, modelValue, ...extra } as any })
  wrappers.push(w); await w.get('input').trigger('click'); return w
}
async function click(selector: string) {
  const el = document.querySelector<HTMLButtonElement>(selector)
  expect(el, selector).not.toBeNull(); el!.click(); await nextTick(); await nextTick()
}
it('selects a year directly and emits its canonical value', async () => {
  const w = await open('year', '2026')
  expect(w.get('input').element.value).toBe('2026')
  await click('[data-year="2028"]')
  expect(w.emitted('change')).toEqual([['2028']])
  expect(document.querySelector('.zt-date-picker__panel')).toBeNull()
})
it('selects a month after changing years without a day grid', async () => {
  const w = await open('month', '2026-09')
  await click('[aria-label="选择年份"]'); await click('[data-year="2027"]')
  expect(w.emitted('change')).toBeUndefined()
  await click('[data-month="1"]')
  expect(w.emitted('change')).toEqual([['2027-02']])
})
it.each([['yearrange', ['2025', '2027'], '[data-year="2028"]', '[data-year="2024"]', ['2024', '2028']], ['monthrange', ['2026-02', '2026-08'], '[data-month="9"]', '[data-month="2"]', ['2026-03', '2026-10']]])('orders two selections for %s', async (type, modelValue, first, last, result) => {
  const w = await open(type as string, modelValue)
  await click(first as string); expect(w.emitted('change')).toBeUndefined()
  await click(last as string); expect(w.emitted('change')).toEqual([[result]])
})
it('disables period selection and skips disabled choices with the keyboard', async () => {
  const w = await open('month', '2026-01', { disabledDate: (date: Date) => date.getMonth() === 1 })
  expect(document.querySelector<HTMLButtonElement>('[data-month="1"]')!.disabled).toBe(true)
  const jan = document.querySelector<HTMLButtonElement>('[data-month="0"]')!
  jan.focus(); jan.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  await nextTick(); await nextTick()
  expect((document.activeElement as HTMLElement).dataset.month).toBe('2')
  expect(w.emitted('change')).toBeUndefined()
})
it('supports inline month ranges via range and resets when type changes', async () => {
  const w = mount(ZtDatePickerPanel, { props: { type: 'month', range: true, modelValue: ['2026-01', '2026-05'] } as any })
  wrappers.push(w)
  await w.get('[data-month="1"]').trigger('click'); await w.get('[data-month="3"]').trigger('click')
  expect(w.emitted('change')).toEqual([[['2026-02', '2026-04']]])
  await w.setProps({ type: 'year', range: false, modelValue: '2026' } as any)
  expect(w.find('[data-year="2026"]').exists()).toBe(true)
})
it('keeps a range draft while browsing to another year', async () => {
  const w = await open('monthrange', ['2026-01', '2026-05'])
  await click('[data-month="10"]'); await click('[aria-label="下一年"]'); await click('[data-month="1"]')
  expect(w.emitted('change')).toEqual([[['2026-11', '2027-02']]])
})
it('reflects externally changed year values in an open panel', async () => {
  const w = await open('year', '2026')
  await w.setProps({ modelValue: '2042' })
  expect(document.querySelector('[data-year="2042"]')).not.toBeNull()
})
it('hides clear by default and emits null once when explicitly cleared', async () => {
  const w = await open('year', '2026')
  expect(w.find('.zt-date-picker__clear').exists()).toBe(false)
  await w.setProps({ clearable: true })
  await w.get('.zt-date-picker__clear').trigger('click')
  expect(w.emitted('update:modelValue')).toEqual([[null]])
  expect(w.emitted('clear')).toHaveLength(1)
})
