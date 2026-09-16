import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ZtPassword } from '../src'

describe('ZtPassword', () => {
  it('uses a password-manager friendly autocomplete default and allows overrides', () => {
    const currentPassword = mount(ZtPassword)
    const newPassword = mount(ZtPassword, { attrs: { autocomplete: 'new-password' } })

    expect(currentPassword.get('input').attributes('autocomplete')).toBe('current-password')
    expect(newPassword.get('input').attributes('autocomplete')).toBe('new-password')
  })

  it('updates its value and toggles password visibility', async () => {
    const wrapper = mount(ZtPassword, { props: { modelValue: '' } })
    const input = wrapper.get('input')

    expect(input.attributes('type')).toBe('password')
    await input.setValue('secret')
    expect(wrapper.emitted('update:modelValue')).toEqual([['secret']])

    await wrapper.get('[aria-label="显示密码"]').trigger('click')
    expect(input.attributes('type')).toBe('text')
    expect(wrapper.get('[aria-label="隐藏密码"]').exists()).toBe(true)
  })

  it('does not expose a visibility control when disabled by configuration', () => {
    const wrapper = mount(ZtPassword, { props: { modelValue: 'secret', showToggle: false } })
    expect(wrapper.find('.zt-password__toggle').exists()).toBe(false)
  })
})
