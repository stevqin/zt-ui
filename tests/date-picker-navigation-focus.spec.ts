import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtDatePicker, ZtDateTimePicker } from '../src'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
async function click(selector: string) {
  document.querySelector<HTMLButtonElement>(selector)!.click()
  await nextTick(); await nextTick()
}
describe.each([ZtDatePicker, ZtDateTimePicker])('navigation focus during DOM replacement', component => {
  for (const range of [false, true]) for (const action of ['前十年', '后十年', '返回日期']) {
    it(`${range ? 'range' : 'single'} keeps popup open on ${action} when removed focus falls to body`, async () => {
      let simulateRemoval = false
      const suffix = component === ZtDateTimePicker ? ' 09:00:00' : ''
      const value = '2026-01-15' + suffix
      const w = mount(component, {
        attachTo: document.body,
        props: { range, modelValue: range ? [value, value] as [string, string] : value },
        global: { mixins: [{ beforeUpdate() {
          // Model a browser that reports body as relatedTarget when a focused
          // year button is removed, before the replacement receives focus.
          if (!simulateRemoval || this.$options.__name !== 'ZtCalendarNavigation') return
          const active = document.activeElement as HTMLElement
          if (!active?.dataset.year) return
          simulateRemoval = false
          active.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }))
        } }] },
      })
      wrappers.push(w)
      await w.get('input').trigger('click')
      await click('[aria-label="选择年份"]')
      expect((document.activeElement as HTMLElement).dataset.year).toBe('2026')
      simulateRemoval = true
      await click(action === '返回日期' ? '.zt-date-picker__back' : `[aria-label="${action}"]`)
      expect(document.querySelector('.zt-date-picker__panel')).not.toBeNull()
      expect(document.querySelector('.zt-date-picker__panel')!.contains(document.activeElement)).toBe(true)
      expect(w.emitted('change')).toBeUndefined()
      const outside = document.createElement('button'); document.body.append(outside); outside.focus()
      await nextTick()
      expect(document.querySelector('.zt-date-picker__panel')).toBeNull()
    })
  }
})
