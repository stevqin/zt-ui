import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { lockBody, unlockBody } from '../src/components/overlay/overlayManager'
import { ZtDatePicker, ZtDatePickerPanel, ZtDateTimePicker } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
const originalWidth = window.innerWidth
async function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
  await nextTick(); await nextTick()
}
async function click(selector: string) {
  document.querySelector<HTMLButtonElement>(selector)!.click()
  await nextTick(); await nextTick()
}
async function open(component = ZtDatePicker, props: Record<string, unknown> = {}) {
  await resize(390)
  const wrapper = mount(component, { attachTo: document.body, props: { modelValue: ['2024-01-15', '2024-01-16'], range: true, ...props } as any })
  wrappers.push(wrapper)
  await wrapper.get('input').trigger('click')
  await nextTick(); await nextTick()
  return wrapper
}
afterEach(async () => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  document.body.style.cssText = ''
  vi.restoreAllMocks()
  await resize(originalWidth)
})

describe('mobile date picker', () => {
  it('waits for confirmation before committing a cross-month range', async () => {
    const wrapper = await open()
    expect(document.querySelectorAll('.zt-date-picker__calendar')).toHaveLength(1)
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.querySelector('[role="dialog"]')!.contains(document.activeElement)).toBe(true)
    await click('[data-date="2024-01-30"]')
    expect(document.querySelector<HTMLButtonElement>('[data-action="confirm"]')?.disabled).toBe(true)
    await click('[aria-label="下个月"]')
    await click('[data-date="2024-02-03"]')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('input').element.value).toBe('2024-01-15 至 2024-01-16')
    await click('[data-action="confirm"]')
    expect(wrapper.emitted('change')).toEqual([[['2024-01-30', '2024-02-03']]])
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(wrapper.get('input').element)
  })
  it('previews a shortcut and discards it when canceled', async () => {
    const wrapper = await open(ZtDatePicker, {
      shortcuts: [{ label: '上月', value: ['2023-12-01', '2023-12-31'] }],
    })
    await click('[data-shortcut="上月"]')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(document.querySelector('.zt-date-picker__summary')?.textContent).toBe('2023-12-01 至 2023-12-31')
    await click('.zt-date-picker__mask')
    expect(wrapper.get('input').element.value).toBe('2024-01-15 至 2024-01-16')
    await wrapper.get('input').trigger('click')
    await click('[data-shortcut="上月"]')
    await click('[data-action="confirm"]')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['2023-12-01', '2023-12-31']]])
  })
  it('cancels a draft with the mask and restores existing body styles', async () => {
    document.body.style.overflow = 'auto'
    const wrapper = await open(ZtDateTimePicker, { range: false, modelValue: '2024-01-15 09:00:00' })
    await click('[data-date="2024-01-20"]')
    await click('.zt-date-picker__mask')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('auto')
    await wrapper.get('input').trigger('click')
    expect(document.querySelector('[data-date="2024-01-15"]')?.getAttribute('aria-pressed')).toBe('true')
  })
  it('preserves datetime edits until confirmation', async () => {
    const wrapper = await open(ZtDateTimePicker, { range: false, modelValue: '2024-01-15 09:00:00' })
    await click('[data-date="2024-01-20"]')
    const time = document.querySelector<HTMLInputElement>('[aria-label="时间"]')!
    time.value = '10:15:30'; time.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
    await click('[data-action="confirm"]')
    expect(wrapper.emitted('change')).toEqual([['2024-01-20 10:15:30']])
  })
  it('preserves draft across resize and restores desktop double month layout', async () => {
    const wrapper = await open()
    await click('[data-date="2024-01-30"]')
    await resize(1024)
    expect(document.querySelectorAll('.zt-date-picker__calendar')).toHaveLength(2)
    expect(document.querySelector('.zt-date-picker__mask')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    await resize(390)
    expect(document.querySelectorAll('.zt-date-picker__calendar')).toHaveLength(1)
    await click('[aria-label="下个月"]')
    await click('[data-date="2024-02-03"]')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('input').element.value).toBe('2024-01-15 至 2024-01-16')
    await click('[data-action="confirm"]')
    expect(wrapper.emitted('change')).toEqual([[['2024-01-30', '2024-02-03']]])
  })
  it('cycles keyboard focus within the sheet and unlocks on unmount', async () => {
    const wrapper = await open(ZtDateTimePicker, { range: false, modelValue: '2024-01-15 09:00:00' })
    const panel = document.querySelector<HTMLElement>('[role="dialog"]')!
    const first = panel.querySelector<HTMLElement>('button:not(:disabled)')!
    const last = panel.querySelector<HTMLElement>('[data-action="confirm"]')!
    last.focus()
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(first)
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(last)
    wrapper.unmount(); wrappers.pop()
    expect(document.body.style.overflow).toBe('')
  })
  it('reopens with focus inside the sheet and closes when disabled', async () => {
    const wrapper = await open()
    await click('.zt-date-picker__mask')
    await wrapper.get('input').trigger('click')
    await nextTick(); await nextTick()
    expect(document.querySelector('[role="dialog"]')!.contains(document.activeElement)).toBe(true)
    await wrapper.setProps({ disabled: true })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })
  it('does not release a parent overlay scroll lock when canceled', async () => {
    const parentLock = Symbol('parent')
    lockBody(parentLock)
    try {
      await open()
      await click('.zt-date-picker__mask')
      expect(document.body.style.overflow).toBe('hidden')
    } finally {
      unlockBody(parentLock)
    }
    expect(document.body.style.overflow).toBe('')
  })
  it('keeps the sheet open when changing month removes the focused day', async () => {
    await resize(390)
    const wrapper = mount(ZtDatePicker, {
      attachTo: document.body,
      props: { range: true, modelValue: ['2024-01-15', '2024-01-16'] },
      global: { mixins: [{ beforeUpdate() {
        if (this.$options.__name !== 'ZtCalendarNavigation') return
        const focused = document.activeElement as HTMLElement
        if (!focused?.dataset.date) return
        const month = (this.$props as { modelValue: Date }).modelValue
        const prefix = `${String(month.getFullYear()).padStart(4, '0')}-${String(month.getMonth() + 1).padStart(2, '0')}`
        if (focused.dataset.date.startsWith(prefix)) return
        focused.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }))
      } }] },
    })
    wrappers.push(wrapper)
    await wrapper.get('input').trigger('click')
    await nextTick(); await nextTick()
    await click('[aria-label="下个月"]')
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.querySelector('[role="dialog"]')!.contains(document.activeElement)).toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
  })
  it('keeps the inline panel nonmodal', async () => {
    await resize(390)
    const wrapper = mount(ZtDatePickerPanel, { attachTo: document.body, props: { range: true } })
    wrappers.push(wrapper)
    expect(document.querySelector('.zt-date-picker__mask')).toBeNull()
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })
})
