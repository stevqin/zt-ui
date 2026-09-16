import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker, ZtForm, ZtFormItem } from '../src'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
describe.each([ZtDatePicker, ZtDateTimePicker])('date picker size', component => {
  it.each(['mini', 'small', 'default', 'medium', 'large'] as const)('applies %s to trigger and teleported range panel', async size => {
    const w = mount(component, { attachTo: document.body, props: { size, range: true } })
    wrappers.push(w)
    await w.get('input').trigger('click')
    expect(w.get('.zt-date-picker').classes()).toContain(`zt-date-picker--${size}`)
    expect(document.querySelector('.zt-date-picker__panel')!.classList.contains(`zt-date-picker--${size}`)).toBe(true)
    await w.setProps({ size: 'large' })
    expect(document.querySelector('.zt-date-picker__panel')!.classList.contains('zt-date-picker--large')).toBe(true)
  })
  it('inherits reactive form size and supports a component override', async () => {
    const explicit = ref<'mini' | undefined>()
    const w = mount(ZtForm, { attachTo: document.body, props: { model: {}, size: 'small' }, slots: {
      default: () => h(ZtFormItem, {}, () => h(component, { size: explicit.value })),
    } })
    wrappers.push(w)
    await w.get('input').trigger('click')
    expect(document.querySelector('.zt-date-picker__panel')!.classList.contains('zt-date-picker--small')).toBe(true)
    await w.setProps({ size: 'large' })
    expect(document.querySelector('.zt-date-picker__panel')!.classList.contains('zt-date-picker--large')).toBe(true)
    explicit.value = 'mini'; await w.vm.$nextTick()
    expect(document.querySelector('.zt-date-picker__panel')!.classList.contains('zt-date-picker--mini')).toBe(true)
  })
})
