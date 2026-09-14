import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZtCheckbox from '../src/components/checkbox/ZtCheckbox.vue'

describe('ZtCheckbox', () => {
  it('stays in sync when modelValue changes externally', async () => {
    const wrapper = mount(ZtCheckbox, { props: { modelValue: false } })
    expect(wrapper.classes()).not.toContain('is-checked')

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('is-checked')
  })
})
