import { searchInput } from './select-test-utils'
import { h, nextTick, reactive } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ZtForm from '../src/components/form/ZtForm.vue'
import ZtFormItem from '../src/components/form/ZtFormItem.vue'
import ZtSelect from '../src/components/select/ZtSelect.vue'

const options = [
  { label: '杭州', value: 'hz' },
  { label: '上海', value: 'sh' },
  { label: '禁用', value: 'disabled', disabled: true },
]

describe('ZtSelect single selection', () => {
  it('keeps exposed open and close idempotent and lets blur leave an open control', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get<HTMLInputElement>('[role="combobox"]')
    try {
      wrapper.vm.focus()
      wrapper.vm.open()
      wrapper.vm.open()
      await nextTick()
      expect(document.activeElement).toBe(combobox.element)
      expect(combobox.attributes('aria-expanded')).toBe('true')

      wrapper.vm.blur()
      await nextTick()
      wrapper.vm.close()
      expect(document.activeElement).not.toBe(combobox.element)
      expect(combobox.attributes('aria-expanded')).toBe('false')
      expect(wrapper.emitted('visible-change')).toEqual([[true], [false]])
      expect(wrapper.emitted('change')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })

  it('closes on stopped outside clicks and preserves focus on the outside control', async () => {
    const outside = document.createElement('button')
    outside.addEventListener('click', event => event.stopPropagation())
    document.body.append(outside)
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    try {
      await wrapper.get('[role="combobox"]').trigger('click')
      outside.focus()
      outside.click()
      await nextTick()
      expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(outside)
      expect(wrapper.emitted('change')).toBeUndefined()
    } finally {
      wrapper.unmount()
      outside.remove()
    }
  })

  it('filters local labels and emits the keyword', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, filterable: true },
    })

    try {
      await (await searchInput(wrapper)).setValue('上')

      expect(wrapper.emitted('search')).toEqual([['上']])
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(document.querySelector('[role="option"]')?.textContent).toBe('上海')
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps an editable search dropdown open when the input is clicked again', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, filterable: true },
    })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await (await searchInput(wrapper)).setValue('上')
      expect(combobox.attributes('aria-expanded')).toBe('true')

      await combobox.trigger('click')
      expect(combobox.attributes('aria-expanded')).toBe('true')
      expect(document.querySelector('[role="option"]')?.textContent).toBe('上海')
    } finally {
      wrapper.unmount()
    }
  })

  it('selects an enabled option and closes single mode', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    await wrapper.get('[role="combobox"]').trigger('click')
    await document.querySelector<HTMLElement>('[role="option"]')!.click()

    expect(wrapper.emitted('update:modelValue')).toEqual([['hz']])
    expect(wrapper.emitted('change')).toEqual([['hz']])
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('keeps a teleported option mounted through the native pointer click sequence', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get<HTMLInputElement>('[role="combobox"]')
    combobox.element.focus()
    await combobox.trigger('click')
    const option = document.querySelector<HTMLElement>('[role="option"]')!
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })

    option.dispatchEvent(mousedown)
    if (!mousedown.defaultPrevented) {
      combobox.element.blur()
      await nextTick()
    }
    option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    if (option.isConnected) option.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mousedown.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([['hz']])
    expect(wrapper.emitted('blur')).toBeUndefined()
    wrapper.unmount()
  })

  it('shows the initial label, ignores disabled options and clears the value', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, modelValue: 'sh', clearable: true },
    })

    expect(wrapper.text()).toContain('上海')
    await wrapper.get('[role="combobox"]').trigger('click')
    await document.querySelectorAll<HTMLElement>('[role="option"]')[2].click()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('[aria-label="清空选择"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('clear')).toEqual([[]])
    wrapper.unmount()
  })

  it('clears a scalar value that is absent from the current options', async () => {
    const wrapper = mount(ZtSelect, {
      props: { options: [], modelValue: 'missing', clearable: true },
    })

    await wrapper.get('[aria-label="清空选择"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('change')).toEqual([[null]])
    wrapper.unmount()
  })

  it('emits visibility changes and exposes focus and blur', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get<HTMLElement>('[role="combobox"]')

    await combobox.trigger('click')
    await combobox.trigger('click')
    expect(wrapper.emitted('visible-change')).toEqual([[true], [false]])

    wrapper.vm.focus()
    expect(document.activeElement).toBe(combobox.element)
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(combobox.element)
    wrapper.unmount()
  })

  it('installs the outside click listener only while open', () => {
    const addEventListener = vi.spyOn(document, 'addEventListener')
    const removeEventListener = vi.spyOn(document, 'removeEventListener')
    const addWindowEventListener = vi.spyOn(window, 'addEventListener')
    const removeWindowEventListener = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(ZtSelect, { props: { options } })
    const clickAdds = () => addEventListener.mock.calls.filter(([type]) => type === 'click')

    expect(clickAdds()).toHaveLength(0)
    wrapper.vm.open()
    expect(clickAdds()).toHaveLength(1)
    const clickHandler = clickAdds()[0][1]
    const scrollHandler = addWindowEventListener.mock.calls.find(([type]) => type === 'scroll')?.[1]
    const resizeHandler = addWindowEventListener.mock.calls.find(([type]) => type === 'resize')?.[1]
    wrapper.vm.close()
    expect(removeEventListener).toHaveBeenCalledWith('click', clickHandler, true)
    expect(removeWindowEventListener).toHaveBeenCalledWith('scroll', scrollHandler, true)
    expect(removeWindowEventListener).toHaveBeenCalledWith('resize', resizeHandler)
    expect(wrapper.emitted('visible-change')).toEqual([[true], [false]])

    wrapper.vm.open()
    const reopenedHandler = clickAdds().at(-1)![1]
    wrapper.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('click', reopenedHandler, true)
    addEventListener.mockRestore()
    removeEventListener.mockRestore()
    addWindowEventListener.mockRestore()
    removeWindowEventListener.mockRestore()
  })

  it('skips disabled options with arrows and selects with Enter', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowUp' })
      const activeId = combobox.attributes('aria-activedescendant')
      expect(document.getElementById(activeId)?.textContent).toBe('上海')
      await combobox.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toEqual([['sh']])
      expect(combobox.attributes('aria-activedescendant')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })

  it('wraps ArrowDown across enabled options and scrolls each active option into view', async () => {
    const scrollIntoView = vi.fn()
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      await combobox.trigger('keydown', { key: 'ArrowDown' })

      const activeId = combobox.attributes('aria-activedescendant')
      expect(document.getElementById(activeId)?.textContent).toBe('杭州')
      expect(scrollIntoView).toHaveBeenCalledTimes(3)
      expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' })
    } finally {
      wrapper.unmount()
      if (original) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', original)
      else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
    }
  })

  it('lets Tab keep its default behavior while closing the listbox', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      expect(combobox.attributes('aria-expanded')).toBe('true')
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      combobox.element.dispatchEvent(event)
      await nextTick()

      expect(event.defaultPrevented).toBe(false)
      expect(combobox.attributes('aria-expanded')).toBe('false')
    } finally {
      wrapper.unmount()
    }
  })

  it('clears active option state when the listbox closes', async () => {
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      const firstActiveId = combobox.attributes('aria-activedescendant')
      expect(document.getElementById(firstActiveId)?.textContent).toBe('杭州')

      await combobox.trigger('keydown', { key: 'Escape' })
      expect(combobox.attributes('aria-activedescendant')).toBeUndefined()

      await combobox.trigger('keydown', { key: 'ArrowDown' })
      const reopenedActiveId = combobox.attributes('aria-activedescendant')
      expect(document.getElementById(reopenedActiveId)?.textContent).toBe('杭州')
    } finally {
      wrapper.unmount()
    }
  })

})

describe('ZtSelect multiple selection', () => {
  it('keeps collapsed labels titled and removable without losing hidden values', async () => {
    const wrapper = mount(ZtSelect, {
      props: {
        options,
        multiple: true,
        collapseTags: true,
        modelValue: ['hz', 'sh'],
      },
    })
    try {
      expect(wrapper.classes()).toContain('is-collapsed')
      expect(wrapper.findAll('.zt-select__tag-label')).toHaveLength(1)
      expect(wrapper.get('.zt-select__tag-label').attributes('title')).toBe('杭州')
      expect(wrapper.get('.zt-select__tag-count').text()).toBe('+1')
      expect(wrapper.get('.zt-select__tag-count').attributes('aria-label')).toBe('另有 1 项已选')
      await wrapper.get('[aria-label="移除杭州"]').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([[['sh']]])
      expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
      expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps searchable header focus and selection independent from the readonly trigger', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, multiple: true, filterable: true, modelValue: ['hz'] },
    })
    try {
      const trigger = wrapper.get('[role="combobox"]')
      expect(trigger.attributes('readonly')).toBeDefined()
      const search = await searchInput(wrapper)
      expect(document.activeElement).toBe(search.element)
      expect(trigger.attributes('aria-haspopup')).toBe('listbox')
      expect(document.getElementById(trigger.attributes('aria-controls'))?.getAttribute('role')).toBe('listbox')
      await search.setValue('上')
      await search.trigger('keydown', { key: 'ArrowDown' })
      await search.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')).toEqual([[['hz', 'sh']]])
      expect(trigger.attributes('aria-expanded')).toBe('true')
      expect(wrapper.get('.zt-select__tag-label').text()).toBe('杭州')

      document.querySelector<HTMLButtonElement>('[aria-label="清空搜索"]')!.click()
      await nextTick()
      expect(search.element.value).toBe('')
      expect(document.activeElement).toBe(search.element)
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(3)
      expect(wrapper.emitted('search')).toEqual([['上'], ['']])
    } finally {
      wrapper.unmount()
    }
  })

  it('closes with Escape and exposes multiple listbox semantics', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, multiple: true },
    })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      const controlledListbox = document.getElementById(combobox.attributes('aria-controls'))
      expect(controlledListbox?.getAttribute('role')).toBe('listbox')
      expect(controlledListbox?.getAttribute('aria-multiselectable')).toBe('true')
      expect(controlledListbox?.querySelector('[role="option"][aria-disabled="true"]')).not.toBeNull()

      await combobox.trigger('keydown', { key: 'Escape' })
      expect(combobox.attributes('aria-expanded')).toBe('false')
      expect(combobox.attributes('aria-activedescendant')).toBeUndefined()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })

  it('normalizes duplicate controlled values on selection and removal', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, multiple: true, modelValue: ['hz', 'hz'] },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await document.querySelectorAll<HTMLElement>('[role="option"]')[1].click()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['hz', 'sh']])

    await wrapper.get('[aria-label="移除杭州"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    wrapper.unmount()
  })

  it('toggles unique values and removes the last tag with Backspace', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, multiple: true, modelValue: ['hz'] },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await document.querySelectorAll<HTMLElement>('[role="option"]')[1].click()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['hz', 'sh']])
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')

    await wrapper.setProps({ modelValue: ['hz', 'sh'] })
    await document.querySelectorAll<HTMLElement>('[role="option"]')[1].click()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['hz']])
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')

    await wrapper.setProps({ modelValue: ['hz'] })
    await wrapper.get('input').trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('remove-tag')?.at(-1)).toEqual(['hz'])
    wrapper.unmount()
  })

  it('removes a selected tag and clears multiple mode to an array', async () => {
    const wrapper = mount(ZtSelect, {
      props: { options, multiple: true, modelValue: ['hz', 'sh'], clearable: true },
    })

    await wrapper.get('[aria-label="移除杭州"]').trigger('click')
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['sh']])

    await wrapper.get('[aria-label="清空选择"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    wrapper.unmount()
  })
})

describe('ZtSelect slots and dropdown placement', () => {
  it('settles popup geometry when Teleport is rendered inline', async () => {
    const wrapper = mount(ZtSelect, {
      props: { options },
      global: { stubs: { teleport: true } },
    })
    try {
      await wrapper.get('[role="combobox"]').trigger('click')
      expect(wrapper.get('[role="listbox"]').exists()).toBe(true)
      await wrapper.get('[role="option"]').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toEqual([['hz']])
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('preserves the trigger width and horizontal alignment at the viewport edge', async () => {
    const width = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 })
    const measure = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const control = this.classList.contains('zt-select__control')
        return {
          x: 2, y: control ? 100 : 0, left: 2, top: control ? 100 : 0,
          right: 432, bottom: control ? 140 : 180, width: 430, height: control ? 40 : 180,
          toJSON: () => ({}),
        }
      })
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options },
      attrs: { style: 'width: 430px' },
    })
    try {
      await wrapper.get('[role="combobox"]').trigger('click')
      const popup = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      expect((wrapper.element as HTMLElement).style.width).toBe('430px')
      expect(popup.style.width).toBe('430px')
      expect(popup.style.left).toBe('2px')
    } finally {
      wrapper.unmount()
      measure.mockRestore()
      if (width) Object.defineProperty(window, 'innerWidth', width)
      else Reflect.deleteProperty(window, 'innerWidth')
    }
  })

  it('keeps nested teleported Select interactions inside the parent and closes both branches', async () => {
    const host = document.createElement('div')
    host.className = 'zt-modal'
    host.style.zIndex = '4100'
    document.body.append(host)
    const wrapper = mount(ZtSelect, {
      attachTo: host,
      props: { options },
      slots: { footer: () => h(ZtSelect, { options, multiple: true }) },
    })
    try {
      const trigger = wrapper.get<HTMLInputElement>('[role="combobox"]')
      trigger.element.focus()
      await trigger.trigger('click')
      const child = wrapper.findAllComponents(ZtSelect).find(candidate => candidate.vm !== wrapper.vm)!
      const childTrigger = child.get<HTMLInputElement>('[role="combobox"]')
      childTrigger.element.focus()
      await childTrigger.trigger('click')
      const popups = document.querySelectorAll<HTMLElement>('.zt-select__dropdown')
      expect(popups).toHaveLength(2)
      expect(popups[0].style.zIndex).toBe('4101')
      expect(popups[1].style.zIndex).toBe('4102')
      popups[1].querySelector<HTMLElement>('[role="option"]')!.click()
      await nextTick()
      expect(child.emitted('update:modelValue')).toEqual([[['hz']]])
      expect(wrapper.emitted('blur')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
      expect(trigger.attributes('aria-expanded')).toBe('true')

      wrapper.vm.close()
      await nextTick()
      expect(document.querySelector('.zt-select__dropdown')).toBeNull()
      expect(child.emitted('visible-change')).toEqual([[true], [false]])
    } finally {
      wrapper.unmount()
      host.remove()
    }
  })

  it('renders prefix, selected, option and footer slots with their scopes', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, modelValue: 'hz' },
      slots: {
        prefix: '<span class="slot-prefix">P</span>',
        selected: ({ option }: { option: (typeof options)[number] }) =>
          h('span', { class: 'slot-selected' }, option.label),
        option: ({ option, selected, disabled }: {
          option: (typeof options)[number]
          selected: boolean
          disabled: boolean
        }) => h('span', { class: 'slot-option' }, `${option.label}:${selected}:${disabled}`),
        footer: '<span class="slot-footer">F</span>',
      },
    })

    try {
      await wrapper.get('[role="combobox"]').trigger('click')

      expect(wrapper.get('.slot-prefix').exists()).toBe(true)
      expect(wrapper.get('.slot-selected').text()).toBe('杭州')
      expect(document.querySelector('.slot-option')?.textContent).toBe('杭州:true:false')
      expect(document.querySelector('.slot-footer')).not.toBeNull()
    } finally {
      wrapper.unmount()
    }
  })

  it('passes a working remove callback to each custom tag', async () => {
    const wrapper = mount(ZtSelect, {
      props: { options, multiple: true, modelValue: ['hz'] },
      slots: {
        tag: ({ option, remove }: {
          option: (typeof options)[number]
          remove: () => void
        }) => h('button', { class: 'slot-tag', onClick: remove }, option.label),
      },
    })

    await wrapper.get('.slot-tag').trigger('click')
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
    wrapper.unmount()
  })

  it('renders the custom empty slot when no options match', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, filterable: true },
      slots: { empty: '<span class="slot-empty">没有匹配项</span>' },
    })

    try {
      await (await searchInput(wrapper)).setValue('不存在')
      expect(document.querySelector('.slot-empty')?.textContent).toBe('没有匹配项')
    } finally {
      wrapper.unmount()
    }
  })

  it('handles Escape from a focusable teleported footer', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options },
      slots: { footer: '<button class="slot-footer-button" type="button">更多</button>' },
    })
    const combobox = wrapper.get<HTMLInputElement>('[role="combobox"]')

    try {
      combobox.element.focus()
      await combobox.trigger('click')
      const footer = document.querySelector<HTMLButtonElement>('.slot-footer-button')!
      footer.focus()
      expect(document.activeElement).toBe(footer)

      footer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await nextTick()
      expect(combobox.attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(combobox.element)
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps native Tab behavior when pressed in a focusable teleported footer', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options },
      slots: { footer: '<button class="slot-footer-button" type="button">更多</button>' },
    })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('click')
      const footer = document.querySelector<HTMLButtonElement>('.slot-footer-button')!
      footer.focus()
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      footer.dispatchEvent(event)
      await nextTick()

      expect(event.defaultPrevented).toBe(false)
      expect(combobox.attributes('aria-expanded')).toBe('false')
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps footer button Enter native without selecting the active option', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options },
      slots: { footer: '<button class="slot-footer-button" type="button">更多</button>' },
    })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('keydown', { key: 'ArrowDown' })
      const footer = document.querySelector<HTMLButtonElement>('.slot-footer-button')!
      footer.focus()
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      footer.dispatchEvent(event)
      await nextTick()

      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(combobox.attributes('aria-expanded')).toBe('true')
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps footer input Backspace native without removing a selected tag', async () => {
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, multiple: true, modelValue: ['hz'] },
      slots: { footer: '<input class="slot-footer-input" value="abc">' },
    })
    const combobox = wrapper.get('[role="combobox"]')

    try {
      await combobox.trigger('click')
      const footerInput = document.querySelector<HTMLInputElement>('.slot-footer-input')!
      footerInput.focus()
      const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
      footerInput.dispatchEvent(event)
      await nextTick()

      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.emitted('remove-tag')).toBeUndefined()
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(combobox.attributes('aria-expanded')).toBe('true')
    } finally {
      wrapper.unmount()
    }
  })

  it('uses fixed trigger coordinates and recalculates upward on captured scroll', async () => {
    let controlTop = 100
    let controlBottom = 140
    const innerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
    const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.classList.contains('zt-select__control')) {
          return {
            x: 40,
            y: controlTop,
            top: controlTop,
            right: 260,
            bottom: controlBottom,
            left: 40,
            width: 220,
            height: 40,
            toJSON: () => ({}),
          }
        }
        if (this.classList.contains('zt-select__dropdown')) {
          return {
            x: 40,
            y: 0,
            top: 0,
            right: 260,
            bottom: 200,
            left: 40,
            width: 220,
            height: 200,
            toJSON: () => ({}),
          }
        }
        return {
          x: 0,
          y: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: 0,
          height: 0,
          toJSON: () => ({}),
        }
      })
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options } })

    try {
      await wrapper.get('[role="combobox"]').trigger('click')
      await nextTick()
      const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!

      expect(dropdown.style.position).toBe('fixed')
      expect(dropdown.style.top).toBe('140px')
      expect(dropdown.style.left).toBe('40px')
      expect(dropdown.style.width).toBe('220px')
      expect(dropdown.dataset.placement).toBe('down')
      expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true)

      controlTop = 500
      controlBottom = 540
      window.dispatchEvent(new Event('scroll'))
      await nextTick()
      expect(dropdown.style.top).toBe('300px')
      expect(dropdown.dataset.placement).toBe('up')

      controlTop = 200
      controlBottom = 240
      window.dispatchEvent(new Event('resize'))
      await nextTick()
      expect(dropdown.style.top).toBe('240px')
      expect(dropdown.dataset.placement).toBe('down')
    } finally {
      wrapper.unmount()
      addEventListener.mockRestore()
      getBoundingClientRect.mockRestore()
      if (innerHeight) Object.defineProperty(window, 'innerHeight', innerHeight)
      else Reflect.deleteProperty(window, 'innerHeight')
    }
  })

  it('repositions an upward local dropdown when filtering shrinks its height', async () => {
    let menuHeight = 200
    let notifyResize: (() => void) | undefined
    const observe = vi.fn()
    const disconnect = vi.fn()
    class ResizeObserverStub {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this as unknown as ResizeObserver)
      }

      observe = observe
      unobserve = vi.fn()
      disconnect = disconnect
    }
    const resizeObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')
    Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: ResizeObserverStub })
    const innerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
    const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const isControl = this.classList.contains('zt-select__control')
        const height = isControl ? 40 : this.classList.contains('zt-select__dropdown') ? menuHeight : 0
        const top = isControl ? 500 : 0
        return {
          x: isControl ? 40 : 0,
          y: top,
          top,
          right: isControl ? 260 : 0,
          bottom: isControl ? 540 : height,
          left: isControl ? 40 : 0,
          width: isControl ? 220 : 0,
          height,
          toJSON: () => ({}),
        }
      })
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: { options, filterable: true },
    })

    try {
      await wrapper.get('[role="combobox"]').trigger('click')
      await nextTick()
      const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!
      expect(dropdown.dataset.placement).toBe('up')
      expect(dropdown.style.top).toBe('300px')
      expect(observe).toHaveBeenCalledWith(dropdown)

      menuHeight = 100
      await (await searchInput(wrapper)).setValue('上')
      notifyResize!()
      await nextTick()
      expect(dropdown.dataset.placement).toBe('up')
      expect(dropdown.style.top).toBe('400px')

      wrapper.vm.close()
      expect(disconnect).toHaveBeenCalledOnce()
    } finally {
      wrapper.unmount()
      getBoundingClientRect.mockRestore()
      if (innerHeight) Object.defineProperty(window, 'innerHeight', innerHeight)
      else Reflect.deleteProperty(window, 'innerHeight')
      if (resizeObserver) Object.defineProperty(globalThis, 'ResizeObserver', resizeObserver)
      else Reflect.deleteProperty(globalThis, 'ResizeObserver')
    }
  })
})

describe('ZtSelect Form integration', () => {
  it('inherits Form state and exposes validation accessibility', () => {
    const wrapper = mount(ZtForm, {
      props: { model: { city: '' }, size: 'mini', disabled: true },
      slots: {
        default: () => h(
          ZtFormItem,
          { prop: 'city', error: '请选择城市' },
          () => h(ZtSelect, { options }),
        ),
      },
    })

    expect(wrapper.get('.zt-select').classes()).toContain('zt-select--mini')
    expect(wrapper.get('[role="combobox"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('[role="combobox"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[role="combobox"]').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="combobox"]').attributes('aria-describedby')).toMatch(/-error$/)
    wrapper.unmount()
  })

  it('validates the Form field after a selection change', async () => {
    const model = reactive({ city: '' })
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: {
        model,
        rules: { city: { required: true, trigger: 'change', message: '请选择城市' } },
      },
      slots: {
        default: () => h(ZtFormItem, { prop: 'city' }, () => h(ZtSelect, {
          options,
          modelValue: model.city,
          'onUpdate:modelValue': (value: unknown) => { model.city = String(value ?? '') },
        })),
      },
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await document.querySelector<HTMLElement>('[role="option"]')!.click()
    await vi.waitFor(() => expect(wrapper.get('.zt-form-item').classes()).toContain('is-success'))
    wrapper.unmount()
  })

  it('validates on blur only after focus leaves the control and listbox', async () => {
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: {
        model: { city: '' },
        rules: { city: { required: true, trigger: 'blur', message: '请选择城市' } },
      },
      slots: {
        default: () => h(ZtFormItem, { prop: 'city' }, () => h(ZtSelect, { options })),
      },
    })
    const combobox = wrapper.get('[role="combobox"]')

    await combobox.trigger('click')
    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')!
    await combobox.trigger('focusout', { relatedTarget: listbox })
    expect(wrapper.get('.zt-form-item').classes()).not.toContain('is-error')

    await combobox.trigger('focusout', { relatedTarget: document.body })
    await vi.waitFor(() => expect(wrapper.get('.zt-form-item').classes()).toContain('is-error'))
    wrapper.unmount()
  })

  it('validates once when focus leaves a teleported footer', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: {
        model: { city: '' },
        rules: { city: { required: true, trigger: 'blur', message: '请选择城市' } },
      },
      slots: {
        default: () => h(ZtFormItem, { prop: 'city' }, () => h(
          ZtSelect,
          { options },
          { footer: () => h('button', { class: 'slot-footer-button', type: 'button' }, '更多') },
        )),
      },
    })
    const select = wrapper.getComponent(ZtSelect)
    const combobox = select.get<HTMLInputElement>('[role="combobox"]')

    try {
      combobox.element.focus()
      await combobox.trigger('click')
      const footer = document.querySelector<HTMLButtonElement>('.slot-footer-button')!
      footer.focus()
      await nextTick()
      expect(select.emitted('blur')).toBeUndefined()
      expect(combobox.attributes('aria-expanded')).toBe('true')

      outside.focus()
      await vi.waitFor(() => expect(wrapper.get('.zt-form-item').classes()).toContain('is-error'))
      expect(select.emitted('blur')).toHaveLength(1)
      expect(combobox.attributes('aria-expanded')).toBe('false')
    } finally {
      wrapper.unmount()
      outside.remove()
    }
  })
})

describe('ZtSelect remote request isolation', () => {
  it.each([false, true])('renders only the latest remote response (multiple=%s)', async multiple => {
    vi.useFakeTimers()
    const pending = new Map<string, (options: Array<{ label: string; value: string }>) => void>()
    const wrapper = mount(ZtSelect, {
      attachTo: document.body,
      props: {
        multiple,
        remote: true,
        debounce: 10,
        remoteMethod: keyword => new Promise(resolve => { pending.set(keyword, resolve) }),
      },
    })
    try {
      const input = await searchInput(wrapper)
      await input.setValue('杭州')
      await vi.advanceTimersByTimeAsync(10)
      await input.setValue('上海')
      await vi.advanceTimersByTimeAsync(10)
      pending.get('上海')!([{ label: '远程上海', value: 'sh' }])
      await flushPromises()
      expect(document.querySelector('[role="option"]')?.textContent).toBe('远程上海')

      pending.get('杭州')!([{ label: '过期杭州', value: 'hz' }])
      await flushPromises()
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(document.querySelector('[role="option"]')?.textContent).toBe('远程上海')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('update:modelValue')).toEqual([[multiple ? ['sh'] : 'sh']])
      expect(wrapper.emitted('remote-error')).toBeUndefined()
    } finally {
      wrapper.unmount()
      vi.useRealTimers()
    }
  })
})
