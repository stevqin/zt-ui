import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZtCheckbox from '../src/components/checkbox/ZtCheckbox.vue'

describe('ZtCheckbox', () => {
  it('hides the native checkbox only when the root owns its accessible role', async () => {
    const wrapper = mount(ZtCheckbox, { props: { modelValue: true, label: '华东' } })
    expect(wrapper.find('input').attributes('aria-hidden')).toBeUndefined()
    await wrapper.setProps({ role: 'checkbox', 'aria-checked': true })
    expect(wrapper.attributes('role')).toBe('checkbox')
    expect(wrapper.find('input').attributes('aria-hidden')).toBe('true')
    await wrapper.setProps({ role: undefined })
    expect(wrapper.find('input').attributes('aria-hidden')).toBeUndefined()
    wrapper.unmount()
  })

  it('stays in sync when modelValue changes externally', async () => {
    const wrapper = mount(ZtCheckbox, { props: { modelValue: false } })
    expect(wrapper.classes()).not.toContain('is-checked')

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('is-checked')
  })
})
