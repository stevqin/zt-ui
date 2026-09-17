import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'

const options = [{ label: '杭州', value: 'hz' }, { label: '上海', value: 'sh' }]
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })

describe('Select multiple search header', () => {
  it('focuses the panel search and keeps the trigger for selected tags only', async () => {
    const w = mount(ZtSelect, { attachTo: document.body, props: { multiple: true, filterable: true, options, modelValue: ['hz'] } })
    wrappers.push(w)
    const trigger = w.get<HTMLInputElement>('.zt-select__input')
    expect(trigger.element.readOnly).toBe(true)
    await trigger.trigger('click')
    await nextTick()
    const search = document.querySelector<HTMLInputElement>('.zt-select__search-input')!
    expect(search).not.toBeNull()
    expect(document.activeElement).toBe(search)
    search.value = '上'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(document.querySelector('[role="option"]')?.textContent).toContain('上海')
    expect(trigger.element.value).toBe('')
    expect(w.get('.zt-select__tags').text()).toContain('杭州')
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(w.emitted('update:modelValue')).toEqual([[['hz', 'sh']]])
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.querySelector('.zt-select__dropdown')).toBeNull()
    expect(document.activeElement).toBe(trigger.element)
    await trigger.trigger('click')
    await nextTick()
    expect(document.querySelector<HTMLInputElement>('.zt-select__search-input')?.value).toBe('上')
    document.querySelector<HTMLButtonElement>('[aria-label="清空搜索"]')!.click()
    await nextTick()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })
})
