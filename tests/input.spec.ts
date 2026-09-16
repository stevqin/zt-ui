import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ZtInput } from '../src'

describe('ZtInput', () => {
  it('passes autocomplete to the native input', () => {
    const wrapper = mount(ZtInput, { props: { autocomplete: 'email' } })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('email')
  })

  it('normalizes browser autofill colors', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/components/input/input.scss'), 'utf8')

    expect(styles).toContain(':-webkit-autofill')
    expect(styles).toContain('-webkit-text-fill-color')
    expect(styles).toContain('caret-color')
  })

  it('emits text updates and native-style interaction events', async () => {
    const wrapper = mount(ZtInput, { props: { modelValue: '' } })
    const input = wrapper.get('input')

    await input.setValue('Zt UI')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Zt UI']])
    expect(wrapper.emitted('input')).toEqual([['Zt UI']])
    expect(wrapper.emitted('change')).toEqual([['Zt UI']])
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('clears a clearable value and restores focus', async () => {
    const wrapper = mount(ZtInput, {
      attachTo: document.body,
      props: { modelValue: 'search', clearable: true },
    })

    await wrapper.get('.zt-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('clear')).toEqual([[]])
    expect(document.activeElement).toBe(wrapper.get('input').element)
    wrapper.unmount()
  })

  it('renders slots, word count, size and disabled state', () => {
    const wrapper = mount(ZtInput, {
      props: { modelValue: 'abcd', maxlength: 10, showWordLimit: true, size: 'large', disabled: true },
      slots: {
        prefix: '<span class="prefix-slot">P</span>',
        suffix: '<span class="suffix-slot">S</span>',
        prepend: '<span class="prepend-slot">https://</span>',
        append: '<span class="append-slot">.com</span>',
      },
    })

    expect(wrapper.classes()).toContain('zt-input--large')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.zt-input__count').text()).toBe('4 / 10')
    for (const slot of ['prefix', 'suffix', 'prepend', 'append']) {
      expect(wrapper.find(`.${slot}-slot`).exists()).toBe(true)
    }
  })
})
