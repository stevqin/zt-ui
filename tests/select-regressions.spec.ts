import { searchInput } from './select-test-utils'
import { compile } from 'sass'
import { resolve } from 'node:path'
import { h, nextTick, reactive, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import ZtSelect from '../src/components/select/ZtSelect.vue'
import ZtForm from '../src/components/form/ZtForm.vue'
import ZtFormItem from '../src/components/form/ZtFormItem.vue'
import ZtModal from '../src/components/modal/ZtModal.vue'
import ZtDrawer from '../src/components/drawer/ZtDrawer.vue'
import { resetOverlayManager } from '../src/components/overlay/overlayManager'
import { useRemoteSearch } from '../src/components/select/useRemoteSearch'
import type { ZtSelectRemoteMethod } from '../src/components/select/types'

const options = [{ label: '杭州', value: 'hz' }, { label: '上海', value: 'sh' }]
const mounted: VueWrapper[] = []
const style = document.createElement('style')
beforeAll(() => {
  style.textContent = compile(resolve(process.cwd(), 'src/components/select/select.scss')).css
  document.head.append(style)
})
afterAll(() => style.remove())
afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount()
  resetOverlayManager()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function select(props = {}, slots = {}) {
  const wrapper = mount(ZtSelect, { attachTo: document.body, props: { options, ...props }, slots })
  mounted.push(wrapper)
  return wrapper
}
function key(element: HTMLElement, key: string, extra = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra })
  element.dispatchEvent(event)
  return event
}

describe('Select search completion and committed values', () => {
  it.each([false, true])('keeps the local keyword after search selection (multiple=%s)', async multiple => {
    const wrapper = select({ filterable: true, multiple })
    await (await searchInput(wrapper)).setValue('上')
    document.querySelector<HTMLElement>('[role="option"]')!.click()
    await wrapper.setProps({ modelValue: multiple ? ['sh'] : 'sh' })
    expect(wrapper.classes()).toContain('has-keyword')
    expect((await searchInput(wrapper)).element.value).toBe('上')
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe(String(multiple))
    if (multiple) {
      expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
      expect(getComputedStyle(wrapper.get('.zt-select__tags').element).opacity).not.toBe('0')
    }
  })

  it.each([false, true].flatMap(multiple => ['escape', 'outside', 'blur', 'api'].map(ending => ({ multiple, ending }))))(
    'keeps an unfinished keyword on $ending (multiple=$multiple)', async ({ multiple, ending }) => {
      const wrapper = select({ filterable: true, multiple, modelValue: multiple ? ['hz'] : 'hz' })
      const input = await searchInput(wrapper)
      input.element.focus()
    await input.setValue('上')
    if (ending === 'escape') key(input.element, 'Escape')
    if (ending === 'outside') document.body.click()
    if (ending === 'blur') wrapper.vm.blur()
    if (ending === 'api') wrapper.vm.close()
    await nextTick()
    expect(wrapper.classes()).toContain('has-keyword')
    expect(input.element.value).toBe('上')
    if (multiple) expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.vm.open()
    await nextTick()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(document.querySelector('[role="option"]')?.textContent).toContain('上海')
  })

  it.each([false, true])('clears both the model and search text (multiple=%s)', async multiple => {
    const wrapper = select({ filterable: true, multiple, modelValue: multiple ? ['hz'] : 'hz', clearable: true })
    await (await searchInput(wrapper)).setValue('上')
    await wrapper.get('[aria-label="清空选择"]').trigger('click')
    await wrapper.setProps({ modelValue: multiple ? [] : null })
    expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('')
    expect(wrapper.classes()).not.toContain('has-keyword')
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择')
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
  })

  it('keeps the keyword and visible tags when a filtered selected option is toggled off', async () => {
    const wrapper = select({ multiple: true, filterable: true, modelValue: ['hz', 'sh'] })
    await (await searchInput(wrapper)).setValue('上')
    document.querySelector<HTMLElement>('[role="option"]')!.click()
    await wrapper.setProps({ modelValue: ['hz'] })
    expect(wrapper.classes()).toContain('has-keyword')
    expect((await searchInput(wrapper)).element.value).toBe('上')
    expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
    expect(getComputedStyle(wrapper.get('.zt-select__tags').element).opacity).not.toBe('0')
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')
  })

  it('keeps the remote keyword and current result after selecting it', async () => {
    vi.useFakeTimers()
    const remoteMethod = vi.fn(async () => [{ label: '上海', value: 'sh' }])
    const wrapper = select({ remote: true, remoteMethod, debounce: 0 })
    const input = await searchInput(wrapper)

    await input.setValue('上')
    await vi.runAllTimersAsync()
    await nextTick()
    document.querySelector<HTMLElement>('[role="option"]')!.click()
    await wrapper.setProps({ modelValue: 'sh' })

    expect(input.element.value).toBe('上')
    expect(wrapper.classes()).toContain('has-keyword')
    wrapper.vm.open()
    await nextTick()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(document.querySelector('[role="option"]')?.textContent).toContain('上海')
  })

  it('treats a scalar controlled model as empty after switching to multiple', async () => {
    const wrapper = select({ modelValue: 'hz' })
    await wrapper.setProps({ multiple: true })
    expect(wrapper.get('input').attributes('placeholder')).toBe('请选择')
    expect(wrapper.find('.zt-select__tags').exists()).toBe(false)
    expect(wrapper.get<HTMLInputElement>('input').element.value).toBe('')
  })

  it.each([false, true])('exposes the committed single label as the native combobox value (filterable=%s)', async filterable => {
    const wrapper = select({ modelValue: 'hz', filterable }, { selected: '<span>自定义外观</span>' })
    const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
    expect(input.element.value).toBe('杭州')
    await wrapper.setProps({ modelValue: 'sh' })
    expect(input.element.value).toBe('上海')
    expect(wrapper.get('.zt-select__value').text()).toBe('自定义外观')
  })

  it('does not emit a change or revalidate when reselecting the same single value', async () => {
    const model = reactive({ city: 'hz' })
    const validator = vi.fn(() => true)
    const wrapper = mount(ZtForm, {
      attachTo: document.body,
      props: { model, rules: { city: { trigger: 'change', validator } } },
      slots: { default: () => h(ZtFormItem, { prop: 'city' }, () => h(ZtSelect, { options, modelValue: model.city })) },
    })
    mounted.push(wrapper)
    const child = wrapper.getComponent(ZtSelect)
    await child.get('input').trigger('click')
    document.querySelector<HTMLElement>('[role="option"]')!.click()
    await nextTick()
    expect(child.emitted('change')).toBeUndefined()
    expect(validator).not.toHaveBeenCalled()
    expect(child.get('input').attributes('aria-expanded')).toBe('false')
  })

  it.each(['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab', 'Backspace'])('leaves composing %s to the IME', async pressed => {
    const wrapper = select({ multiple: true, modelValue: ['hz'] })
    const input = await searchInput(wrapper)
    await input.trigger('keydown', { key: 'ArrowDown' })
    const active = input.attributes('aria-activedescendant')
    const event = key(input.element, pressed, { isComposing: true })
    await nextTick()
    expect(event.defaultPrevented).toBe(false)
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-activedescendant')).toBe(active)
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})

describe('Select inside default overlay focus and keyboard ownership', () => {
  for (const [name, component] of [['Modal', ZtModal], ['Drawer', ZtDrawer]] as const) {
    it(`${name}: first Escape closes Select, second Escape closes the parent`, async () => {
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        slots: { default: () => h(ZtSelect, { options }) },
      })
      mounted.push(wrapper)
      await nextTick()
      const input = document.querySelector<HTMLInputElement>('[role="combobox"]')!
      input.focus()
      input.click()
      await nextTick()
      const first = key(input, 'Escape')
      await nextTick()
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(wrapper.emitted('close')).toBeUndefined()
      expect(document.activeElement).toBe(input)
      expect(first.defaultPrevented).toBe(true)
      key(input, 'Escape')
      await nextTick()
      expect(wrapper.emitted('close')).toEqual([['escape']])
    })

    it(`${name}: owns teleported footer focus without emitting blur or stealing it`, async () => {
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        slots: { default: () => h(ZtSelect, { options }, { footer: () => h('button', { class: 'footer-action' }, '更多') }) },
      })
      mounted.push(wrapper)
      await nextTick()
      const child = wrapper.getComponent(ZtSelect)
      const input = document.querySelector<HTMLInputElement>('[role="combobox"]')!
      input.focus()
      input.click()
      await nextTick()
      const footer = document.querySelector<HTMLButtonElement>('.footer-action')!
      footer.focus()
      await nextTick()
      expect(document.activeElement).toBe(footer)
      expect(child.emitted('blur')).toBeUndefined()
      expect(input.getAttribute('aria-expanded')).toBe('true')
      key(footer, 'Escape')
      await nextTick()
      expect(document.activeElement).toBe(input)
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(wrapper.emitted('close')).toBeUndefined()
      expect(child.emitted('blur')).toBeUndefined()
    })

    it(`${name}: preserves footer focus established during the enter transition`, async () => {
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        global: { stubs: { transition: false } },
        slots: { default: () => h(ZtSelect, { options }, { footer: () => h('button', { class: 'footer-action' }, '更多') }) },
      })
      mounted.push(wrapper)
      await nextTick()
      const child = wrapper.getComponent(ZtSelect)
      await child.get('input').trigger('click')
      const footer = document.querySelector<HTMLButtonElement>('.footer-action')!
      footer.focus()
      await vi.waitFor(() => expect(wrapper.emitted('opened')?.length ?? 0).toBeGreaterThan(0))
      expect(document.activeElement).toBe(footer)
      expect(child.emitted('blur')).toBeUndefined()
      expect(child.get('input').attributes('aria-expanded')).toBe('true')
    })

    it.each([false, true])(`${name}: Tab leaves the footer at the Select's position (shift=%s)`, async shiftKey => {
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        slots: { default: () => [
          h('button', { class: 'before-select' }, '前一项'),
          h(ZtSelect, { options, multiple: true, modelValue: ['hz'], clearable: true }, {
            tag: ({ remove }: { remove: () => void }) => h('button', { onClick: remove }, '移除'),
            footer: () => h('button', { class: 'footer-action' }, '更多'),
          }),
          h('button', { class: 'after-select' }, '后一项'),
        ] },
      })
      mounted.push(wrapper)
      await nextTick()
      const child = wrapper.getComponent(ZtSelect)
      await child.get('input').trigger('click')
      const footer = document.querySelector<HTMLButtonElement>('.footer-action')!
      footer.focus()
      key(footer, 'Tab', { shiftKey })
      await nextTick()
      expect(document.activeElement).toBe(document.querySelector(shiftKey ? '.before-select' : '.after-select'))
      expect(child.get('input').attributes('aria-expanded')).toBe('false')
      expect(child.emitted('blur')).toHaveLength(1)
    })

    it(`${name}: closes its child popup when hidden and cannot reopen it until the parent returns`, async () => {
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        slots: { default: () => h(ZtSelect, { options }) },
      })
      mounted.push(wrapper)
      await nextTick()
      const child = wrapper.getComponent(ZtSelect)
      child.vm.open()
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      expect(document.querySelector('.zt-select__dropdown')).toBeNull()
      child.vm.open()
      await nextTick()
      expect(document.querySelector('.zt-select__dropdown')).toBeNull()
    })

    it.each([false, true])(`${name}: restores a destroyed footer opener through its Select trigger (sibling=%s)`, async sibling => {
      const nestedVisible = ref(false)
      const closed = vi.fn()
      const renderNested = () => h(ZtModal, {
        modelValue: nestedVisible.value,
        'onUpdate:modelValue': value => { nestedVisible.value = value },
        onClosed: closed,
        title: '新建选项',
      }, { default: () => h('input', { class: 'nested-field' }) })
      const wrapper = mount({ render: () => [
        h(component, { modelValue: true }, { default: () => [
          h(ZtSelect, { options }, {
            footer: () => h('button', {
              class: 'nested-opener',
              onClick: () => { nestedVisible.value = true },
            }, '新建选项'),
          }),
          sibling ? null : renderNested(),
        ] }),
        sibling ? renderNested() : null,
      ] }, {
        attachTo: document.body,
        global: { stubs: { transition: false } },
      })
      mounted.push(wrapper)
      const outer = wrapper.getComponent(component)
      await vi.waitFor(() => expect(outer.emitted('opened')?.length ?? 0).toBeGreaterThan(0))
      const child = wrapper.getComponent(ZtSelect)
      const input = child.get<HTMLInputElement>('input')
      input.element.focus()
      await input.trigger('click')
      const opener = document.querySelector<HTMLButtonElement>('.nested-opener')!
      opener.focus()
      opener.click()
      await nextTick()
      expect(opener.isConnected).toBe(false)
      expect(input.attributes('aria-expanded')).toBe('false')
      const nestedInput = document.querySelector<HTMLInputElement>('.nested-field')!
      nestedInput.focus()
      key(nestedInput, 'Escape')
      await vi.waitFor(() => expect(closed).toHaveBeenCalled())
      await nextTick()
      expect(document.activeElement).toBe(input.element)
      expect(outer.emitted('close')).toBeUndefined()
      expect(input.attributes('aria-expanded')).toBe('false')
    })

    it(`${name}: prefers a connected opener over the captured Select fallback`, async () => {
      const nestedVisible = ref(false)
      const closed = vi.fn()
      const wrapper = mount(component, {
        attachTo: document.body,
        props: { modelValue: true },
        global: { stubs: { transition: false } },
        slots: { default: () => [
          h(ZtSelect, { options, multiple: true, modelValue: ['hz'] }, {
            tag: () => h('button', {
              class: 'retained-opener',
              onClick: () => { nestedVisible.value = true },
            }, '编辑选项'),
          }),
          h(ZtModal, {
            modelValue: nestedVisible.value,
            'onUpdate:modelValue': value => { nestedVisible.value = value },
            onClosed: closed,
          }, { default: () => h('input', { class: 'nested-field' }) }),
        ] },
      })
      mounted.push(wrapper)
      await vi.waitFor(() => expect(wrapper.emitted('opened')?.length ?? 0).toBeGreaterThan(0))
      wrapper.getComponent(ZtSelect).vm.open()
      await nextTick()
      const opener = document.querySelector<HTMLButtonElement>('.retained-opener')!
      opener.focus()
      opener.click()
      await nextTick()
      expect(opener.isConnected).toBe(true)
      const nestedInput = document.querySelector<HTMLInputElement>('.nested-field')!
      nestedInput.focus()
      key(nestedInput, 'Escape')
      await vi.waitFor(() => expect(closed).toHaveBeenCalled())
      await nextTick()
      expect(document.activeElement).toBe(opener)
    })
  }
})

describe('Select overflow interaction and viewport geometry', () => {
  it('allows native vertical scrolling over wrapped tags and opens when their label is clicked', async () => {
    const wrapper = select({ multiple: true, modelValue: ['hz', 'sh'] })
    const tags = wrapper.get<HTMLElement>('.zt-select__tags').element
    Object.defineProperties(tags, {
      scrollWidth: { value: 150 }, clientWidth: { value: 150 },
      scrollHeight: { value: 400 }, clientHeight: { value: 68 },
    })
    expect(getComputedStyle(tags).pointerEvents).toBe('auto')
    expect(getComputedStyle(tags).overflowY).toBe('auto')
    const wheel = new WheelEvent('wheel', { deltaY: 80, bubbles: true, cancelable: true })
    tags.dispatchEvent(wheel)
    expect(tags.scrollLeft).toBe(0)
    expect(wheel.defaultPrevented).toBe(false)
    tags.click()
    await nextTick()
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(wrapper.get('input').element)
    await wrapper.get('.zt-select__tag-remove').trigger('click')
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
  })

  it('preserves a custom tag removal control without opening the dropdown', async () => {
    const wrapper = select({ multiple: true, modelValue: ['hz'] }, {
      tag: ({ remove }: { remove: () => void }) => h('button', { class: 'custom-remove', onClick: remove }, '移除'),
    })
    await wrapper.get('.custom-remove').trigger('click')
    expect(wrapper.emitted('remove-tag')).toEqual([['hz']])
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false')
  })

  it('keeps input focus through a native pointer click on a default tag label', async () => {
    const wrapper = select({ multiple: true, modelValue: ['hz'] })
    const input = await searchInput(wrapper)
    input.element.focus()
    const tags = wrapper.get<HTMLElement>('.zt-select__tags').element
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    tags.dispatchEvent(down)
    if (!down.defaultPrevented) input.element.blur()
    tags.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    tags.click()
    await nextTick()
    expect(wrapper.emitted('blur')).toBeUndefined()
    expect(document.activeElement).toBe(input.element)
    expect(input.attributes('aria-expanded')).toBe('true')
  })

  it.each([
    { top: 140, bottom: 174, placement: 'up', popupTop: '14px', popupHeight: '126px', listHeight: '76px' },
    { top: 90, bottom: 124, placement: 'down', popupTop: '124px', popupHeight: '162px', listHeight: '112px' },
  ])('constrains an oversized $placement popup including footer, borders and gap', async fixture => {
    vi.stubGlobal('innerHeight', 300)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const control = this.classList.contains('zt-select__control')
      const height = control ? 34 : this.classList.contains('zt-select__dropdown') ? 330 : this.classList.contains('zt-select__footer') ? 48 : 0
      const top = control ? fixture.top : 0
      return { x: 20, y: top, left: 20, top, right: 260, bottom: top + height, width: 240, height, toJSON: () => ({}) }
    })
    const wrapper = select({}, { footer: '<button>更多操作</button>' })
    await wrapper.get('input').trigger('click')
    await nextTick()
    const dropdown = document.querySelector<HTMLElement>('.zt-select__dropdown')!
    const list = document.querySelector<HTMLElement>('.zt-select__list')!
    expect(dropdown.dataset.placement).toBe(fixture.placement)
    expect(dropdown.style.maxHeight).toBe(fixture.popupHeight)
    expect(dropdown.style.top).toBe(fixture.popupTop)
    expect(list.style.maxHeight).toBe(fixture.listHeight)
    expect(getComputedStyle(list).overflowY).toBe('auto')
  })
})

describe('Select missing remote methods and falsy failures', () => {
  it.each([false, true])('keeps the remote keyword after committing a selection (multiple=%s)', async multiple => {
    vi.useFakeTimers()
    const wrapper = select({ multiple, remote: true, remoteMethod: async () => options, debounce: 0 })
    await (await searchInput(wrapper)).setValue('城市')
    await vi.runAllTimersAsync()
    document.querySelector<HTMLElement>('[role="option"]')!.click()
    await wrapper.setProps({ modelValue: multiple ? ['hz'] : 'hz' })
    expect(wrapper.classes()).toContain('has-keyword')
    expect((await searchInput(wrapper)).element.value).toBe('城市')
    expect(wrapper.get('input').attributes('aria-expanded')).toBe(String(multiple))
    if (multiple) {
      expect(wrapper.get('.zt-select__tags').attributes('inert')).toBeUndefined()
      expect(getComputedStyle(wrapper.get('.zt-select__tags').element).opacity).not.toBe('0')
    }
  })

  it('shows no data when remote is enabled without a method, even with initial options', async () => {
    const wrapper = select({ remote: true })
    await wrapper.get('input').trigger('click')
    expect(document.querySelector('[role="option"]')).toBeNull()
    expect(document.querySelector('.zt-select__empty')?.textContent).toBe('暂无数据')
  })

  it('discards old results when a remote method disappears and later returns', async () => {
    vi.useFakeTimers()
    const method: ZtSelectRemoteMethod = async () => options
    const wrapper = select({ remote: true, remoteMethod: method, debounce: 0 })
    await (await searchInput(wrapper)).setValue('城市')
    await vi.runAllTimersAsync()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
    await wrapper.setProps({ remoteMethod: undefined })
    expect(document.querySelector('[role="option"]')).toBeNull()
    await wrapper.setProps({ remoteMethod: method })
    expect(document.querySelector('[role="option"]')).toBeNull()
    expect(document.querySelector('.zt-select__empty')?.textContent).toBe('暂无数据')
  })

  it('invalidates pending remote results when the method is removed', async () => {
    vi.useFakeTimers()
    let complete!: (value: typeof options) => void
    const method = ref<ZtSelectRemoteMethod | undefined>(() => new Promise(resolve => { complete = resolve }))
    const remote = useRemoteSearch(method, ref(0))
    try {
      remote.search('城市')
      await vi.runAllTimersAsync()
      method.value = undefined
      await nextTick()
      complete(options)
      await nextTick()
      expect(remote.options.value).toEqual([])
      expect(remote.loading.value).toBe(false)
    } finally { remote.dispose() }
  })

  it.each([null, undefined, false, 0, ''])('shows failure UI for rejection reason %s', async reason => {
    vi.useFakeTimers()
    const wrapper = select({ remote: true, remoteMethod: () => Promise.reject(reason), debounce: 0 })
    await (await searchInput(wrapper)).setValue('失败')
    await vi.runAllTimersAsync()
    expect(document.querySelector('.zt-select__error')?.textContent).toBe('加载失败，请重试')
    expect(wrapper.emitted('remote-error')).toEqual([[reason]])
    await wrapper.setProps({ remoteMethod: async () => options })
    await (await searchInput(wrapper)).setValue('恢复')
    await vi.runAllTimersAsync()
    expect(document.querySelector('.zt-select__error')).toBeNull()
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
  })
})
