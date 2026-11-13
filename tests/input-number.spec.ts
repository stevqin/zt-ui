import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ZtInputNumber } from '../src'

describe('ZtInputNumber', () => {
  it('increments, decrements and clamps values at configured bounds', async () => {
    const wrapper = mount(ZtInputNumber, {
      props: { modelValue: 2, min: 1, max: 3, step: 1 },
    })

    await wrapper.get('[aria-label="增加数值"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
    expect(wrapper.emitted('change')).toEqual([[3, 2]])

    await wrapper.setProps({ modelValue: 3 })
    expect(wrapper.get<HTMLButtonElement>('[aria-label="增加数值"]').element.disabled).toBe(true)

    await wrapper.get('[aria-label="减少数值"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
  })

  it('normalizes typed values using precision and strict steps', async () => {
    const wrapper = mount(ZtInputNumber, {
      props: { modelValue: 0, min: 0, max: 10, step: 0.25, precision: 2, stepStrictly: true },
    })
    const input = wrapper.get('input')

    await input.setValue('1.38')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.5])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([1.5, 0])
  })

  it('groups money while editing and preserves the draft when v-model echoes input', async () => {
    const wrapper = mount(ZtInputNumber, {
      props: {
        modelValue: 1234.5,
        money: true,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
      },
    })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('1,234.50')
    await input.trigger('focus')
    expect(input.element.value).toBe('1,234.50')
    input.element.value = '1234.'
    await input.trigger('input')
    expect(input.element.value).toBe('1,234.')
    input.element.value = '¥9,876.5'
    await input.trigger('input')
    expect(input.element.value).toBe('9,876.5')
    await input.trigger('change')
    await input.trigger('blur')
    expect(wrapper.props('modelValue')).toBe(9876.5)
    expect(input.element.value).toBe('9,876.50')
  })

  it.each([
    ['insertText', '1,2934.50', 4, '12,934.50', 4, 12934.5],
    ['deleteContentBackward', '1234.50', 1, '234.50', 0, 234.5],
    ['deleteContentForward', '1234.50', 1, '134.50', 1, 134.5],
  ] as const)('keeps the caret at the edited digit after %s', async (inputType, raw, caret, formatted, expectedCaret, amount) => {
    const wrapper = mount(ZtInputNumber, { props: { modelValue: 1234.5, money: true } })
    const input = wrapper.get('input')
    await input.trigger('focus')
    input.element.value = raw
    input.element.setSelectionRange(caret, caret)
    await input.trigger('input', { inputType })
    expect(input.element.value).toBe(formatted)
    expect(input.element.selectionStart).toBe(expectedCaret)
    expect(wrapper.emitted('update:modelValue')).toEqual([[amount]])
  })

  it('uses configured money precision and keeps empty and invalid inputs distinct from zero', async () => {
    const wrapper = mount(ZtInputNumber, { props: { money: true, precision: 3, modelValue: -1234.5 } })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('-1,234.500')
    input.element.value = '12,34'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await input.trigger('change')
    expect(input.element.value).toBe('-1,234.500')
    await input.setValue('')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    await wrapper.setProps({ money: false, modelValue: 1234.5 })
    expect(input.element.value).toBe('1234.500')
  })

  it('supports an empty value, keyboard controls, sizes and read-only mode', async () => {
    const empty = mount(ZtInputNumber, { props: { modelValue: 2, size: 'mini' } })
    await empty.get('input').setValue('')
    expect(empty.emitted('update:modelValue')).toEqual([[null]])
    expect(empty.classes()).toContain('zt-input-number--mini')

    const keyboard = mount(ZtInputNumber, { props: { modelValue: 4, step: 2 } })
    await keyboard.get('input').trigger('keydown', { key: 'ArrowUp' })
    expect(keyboard.emitted('update:modelValue')).toEqual([[6]])

    const readonly = mount(ZtInputNumber, { props: { modelValue: 4, readonly: true } })
    expect(readonly.get('input').attributes('readonly')).toBeDefined()
    expect(readonly.findAll('button').every(button => button.attributes('disabled') !== undefined)).toBe(true)
  })

  it('uses the full field width when controls are hidden', () => {
    const wrapper = mount(ZtInputNumber, {
      props: { modelValue: 4, controls: false },
      attrs: { class: 'custom-number', placeholder: '数量' },
    })

    expect(wrapper.classes()).toContain('zt-input-number--without-controls')
    expect(wrapper.classes()).toContain('custom-number')
    expect(wrapper.get('input').attributes('placeholder')).toBe('数量')
  })

  it('supports split, left-stacked and right-stacked controls', () => {
    const split = mount(ZtInputNumber, { props: { modelValue: 1 } })
    const left = mount(ZtInputNumber, { props: { modelValue: 1, controlsPosition: 'left' } })
    const right = mount(ZtInputNumber, { props: { modelValue: 1, controlsPosition: 'right' } })

    expect(split.classes()).not.toContain('zt-input-number--controls-left')
    expect(split.classes()).not.toContain('zt-input-number--controls-right')
    expect(left.classes()).toContain('zt-input-number--controls-left')
    expect(right.classes()).toContain('zt-input-number--controls-right')
    expect(left.findAll('.zt-input-number__control')).toHaveLength(2)
    expect(right.findAll('.zt-input-number__control')).toHaveLength(2)
  })
})
