import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { compile } from 'sass'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
const sheet = document.createElement('style')
beforeAll(() => {
  sheet.textContent = compile('src/components/date-picker/date-picker.scss').css
  document.head.append(sheet)
})
afterAll(() => sheet.remove())
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
const holidays = [
  { key: '2024-02-10', value: '示例节日', type: 'holiday' as const },
  { key: '2024-02-18', value: '公司活动日', type: 'workday' as const },
]
describe.each([ZtDatePicker, ZtDateTimePicker])('holiday annotations', component => {
  it('shows supplied holiday names accessibly without disabling selection', async () => {
    const wrapper = mount(component, { props: { modelValue: component === ZtDatePicker ? '2024-02-15' : '2024-02-15 09:00:00', holidays } })
    wrappers.push(wrapper)
    await wrapper.get('input').trigger('click')
    const holiday = document.querySelector<HTMLButtonElement>('[data-date="2024-02-10"]')!
    expect(holiday.textContent).toContain('示例节日')
    expect(holiday.title).toBe('示例节日')
    expect(holiday.getAttribute('aria-label')).toBe('2024-02-10 示例节日 休')
    expect(holiday.disabled).toBe(false)
    expect(document.querySelector('[data-date="2024-02-18"]')?.textContent).toContain('公司活动日')
    expect(holiday.querySelector('.zt-date-picker__holiday-badge')?.textContent).toBe('休')
    expect(document.querySelector('[data-date="2024-02-18"] .zt-date-picker__holiday-badge')?.textContent).toBe('班')
    expect(document.querySelector('[data-date="2024-02-18"]')?.getAttribute('aria-label')).toBe('2024-02-18 公司活动日 班')
    expect(holiday.classList.contains('is-holiday')).toBe(true)
    expect(document.querySelector('[data-date="2024-02-18"]')?.classList.contains('is-workday')).toBe(true)
    holiday.click(); await nextTick()
    if (component === ZtDateTimePicker) { document.querySelector<HTMLButtonElement>('[data-action="confirm"]')!.click(); await nextTick() }
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(component === ZtDatePicker ? '2024-02-10' : '2024-02-10 09:00:00')
  })
  it('updates annotations reactively and can hide them without changing the value', async () => {
    const wrapper = mount(component, { props: { modelValue: component === ZtDatePicker ? '2024-02-15' : '2024-02-15 09:00:00', holidays } })
    wrappers.push(wrapper)
    await wrapper.get('input').trigger('click')
    await wrapper.setProps({ holidays: [{ key: '2024-02-10', value: '公司安排' }] })
    expect(document.querySelector<HTMLButtonElement>('[data-date="2024-02-10"]')!.title).toBe('公司安排')
    await wrapper.setProps({ showHolidays: false })
    expect(document.querySelector('.zt-date-picker__holiday')).toBeNull()
    expect(document.querySelector('[data-date="2024-02-10"]')?.getAttribute('aria-label')).toBe('2024-02-10')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
  it('preserves disabledDate for a marked holiday in range mode', async () => {
    const dt = component === ZtDateTimePicker ? ' 09:00:00' : ''
    const wrapper = mount(component, { props: { range: true, modelValue: ['2024-02-10' + dt, '2024-02-15' + dt], holidays, disabledDate: (date: Date) => date.getDate() === 10 } })
    wrappers.push(wrapper)
    await wrapper.get('input').trigger('click')
    const holiday = document.querySelector<HTMLButtonElement>('[data-date="2024-02-10"]')!
    expect(holiday.disabled).toBe(true)
    expect(holiday.textContent).toContain('示例节日')
  })
})

it('renders holiday and workday markers as legible circular badges', async () => {
  const wrapper = mount(ZtDatePicker, {
    attachTo: document.body,
    props: { modelValue: '2024-02-15', holidays },
  })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')

  const holidayBadge = document.querySelector<HTMLElement>('[data-date="2024-02-10"] .zt-date-picker__holiday-badge')!
  const workdayBadge = document.querySelector<HTMLElement>('[data-date="2024-02-18"] .zt-date-picker__holiday-badge')!
  const holidayStyle = getComputedStyle(holidayBadge)
  const workdayStyle = getComputedStyle(workdayBadge)

  expect(holidayStyle.width).toBe('15px')
  expect(holidayStyle.height).toBe('15px')
  expect(holidayStyle.borderRadius).toBe('50%')
  expect(holidayStyle.display).toBe('inline-flex')
  expect(holidayStyle.alignItems).toBe('center')
  expect(holidayStyle.justifyContent).toBe('center')
  expect(holidayStyle.color).not.toBe(holidayStyle.backgroundColor)
  expect(workdayStyle.color).not.toBe(workdayStyle.backgroundColor)
  expect(workdayStyle.backgroundColor).not.toBe(holidayStyle.backgroundColor)
})

it('ignores invalid dates and blank labels, and takes the last label for duplicates', async () => {
  const wrapper = mount(ZtDatePicker, { props: { modelValue: '2024-02-10', holidays: [
    { key: '2024-02-10', value: '旧名称' },
    { key: '2024-02-10', value: '新名称' },
    { key: '2024-02-11', value: '  ' },
    { key: '2024-02-30', value: '无效日期' },
  ] } })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  expect(document.querySelectorAll('.zt-date-picker__holiday')).toHaveLength(1)
  expect(document.querySelector('.zt-date-picker__holiday')?.textContent).toBe('新名称')
})
