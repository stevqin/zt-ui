import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
describe.each([ZtDatePicker, ZtDateTimePicker])('date picker themes', component => {
  it.each(['default', 'primary', 'success', 'warning', 'danger', 'info'] as const)('keeps %s theme on the input and teleported calendar', async status => {
    const wrapper = mount(component, { attachTo: document.body, props: { status } })
    wrappers.push(wrapper)
    expect(wrapper.find(`.zt-date-picker--status-${status}`).exists()).toBe(true)
    await wrapper.get('input').trigger('click')
    expect(document.querySelector('.zt-date-picker__panel')?.classList.contains(`zt-date-picker--status-${status}`)).toBe(true)
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
    await wrapper.setProps({ status: 'danger' })
    expect(document.querySelector('.zt-date-picker__panel')?.classList.contains('zt-date-picker--status-danger')).toBe(true)
  })
  it('preserves the legacy error validation status', async () => {
    const wrapper = mount(component, { props: { status: 'error' } })
    wrappers.push(wrapper)
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })
})
