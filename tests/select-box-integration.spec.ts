import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, reactive } from 'vue'
import ZtSelectBox from '../src/components/select-box/ZtSelectBox.vue'
import SelectBoxPanel from '../src/components/select-box/SelectBoxPanel.vue'
import ZtConfigProvider from '../src/components/config-provider/ZtConfigProvider.vue'
import ZtForm from '../src/components/form/ZtForm.vue'
import ZtFormItem from '../src/components/form/ZtFormItem.vue'
import type { ZtSelectBoxProps, ZtSelectBoxRemoteResult, ZtSelectValue } from '../src/components/select-box/types'
import type { ZtComponentSize } from '../src/components/types'

const options = Array.from({ length: 25 }, (_, value) => ({ value, label: `选项 ${value}` }))
const wrappers: VueWrapper[] = []
function box(props: ZtSelectBoxProps = {}) {
  const w = mount(ZtSelectBox, { attachTo: document.body, props: { options, ...props } })
  wrappers.push(w)
  return w
}
const trigger = (w: VueWrapper) => w.get<HTMLButtonElement>('.zt-select-box__trigger')
const popup = () => document.querySelector<HTMLElement>('.zt-select-box__popup')
async function click(selector: string) {
  document.querySelector<HTMLElement>(selector)!.click()
  await flushPromises()
}
async function open(w: VueWrapper) {
  trigger(w).element.focus()
  await trigger(w).trigger('click')
  await flushPromises()
}
function outside() {
  const input = document.createElement('input')
  document.body.append(input)
  return input
}
function form(props: ZtSelectBoxProps = {}, triggerRule: 'change' | 'blur' = 'change') {
  const model = reactive({ regions: props.modelValue ?? [] as ZtSelectValue[] })
  const controlProps = reactive({ ...props })
  const order: unknown[] = []
  const w = mount(ZtForm, {
    attachTo: document.body,
    props: { model, size: 'small', rules: { regions: { required: true, trigger: triggerRule, message: '请选择区域' } } },
    slots: { default: () => h(ZtFormItem, { prop: 'regions', label: '区域' }, {
      default: () => h(ZtSelectBox, { options, clearable: true, ...controlProps, modelValue: model.regions,
        'onUpdate:modelValue': value => { order.push(['update', value]); model.regions = value },
        onChange: value => order.push(['change', value]), onClear: () => order.push(['clear']), 'aria-describedby': 'region-hint' }),
    }) },
  })
  wrappers.push(w)
  return { w, model, order, controlProps, select: w.findComponent(ZtSelectBox) }
}
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('SelectBox clear transaction', () => {
  it.each(['button', 'exposed'] as const)('clears using %s in event order, validates change, and retains focus without opening', async action => {
    const { w, model, select, order } = form({ modelValue: [0] })
    trigger(select).element.focus()
    if (action === 'button') await select.get('.zt-select-box__clear').trigger('click')
    else select.vm.clear()
    await flushPromises()
    expect(order).toEqual([['update', []], ['change', []], ['clear']])
    expect(model.regions).toEqual([])
    expect(w.findComponent(ZtFormItem).classes()).toContain('is-error')
    expect(trigger(select).attributes('aria-invalid')).toBe('true')
    expect(popup()).toBeNull()
    expect(select.emitted('visible-change')).toBeUndefined()
    expect(document.activeElement).toBe(trigger(select).element)
    expect(select.find('.zt-select-box__clear').exists()).toBe(false)
  })
  it.each(['button', 'exposed'] as const)('keeps the open panel and resets draft, search and page using %s', async action => {
    const { select } = form({ modelValue: [0] })
    await open(select)
    await select.findComponent(SelectBoxPanel).get('input[aria-label="搜索选项"]').setValue('选项')
    await click('[aria-label="下一页"]')
    await click('.zt-select-box-panel__option')
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('2')
    if (action === 'button') {
      const clear = select.get('.zt-select-box__clear')
      const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
      clear.element.dispatchEvent(down)
      expect(down.defaultPrevented).toBe(true)
      await clear.trigger('click')
    } else select.vm.clear()
    await flushPromises()
    expect(popup()).not.toBeNull()
    expect(select.emitted('visible-change')).toEqual([[true]])
    expect(document.querySelector<HTMLInputElement>('input[aria-label="搜索选项"]')?.value).toBe('')
    expect(document.querySelector('[aria-current="page"]')?.textContent).toBe('1')
    expect(document.querySelectorAll('.zt-select-box-panel__option[aria-checked="true"]')).toHaveLength(0)
    expect(document.querySelector('.zt-select-box-panel__selection strong')?.textContent).toBe('0')
    expect(document.activeElement).toBe(trigger(select).element)
    await click('.zt-select-box-panel__confirm')
    expect(select.emitted('update:modelValue')).toEqual([[[]], [[]]])
  })
  it('clears an open draft immediately even without a parent model update', async () => {
    const w = box({ modelValue: [0], clearable: true })
    await open(w)
    await click('.zt-select-box-panel__option')
    await click('.zt-select-box-panel__option:nth-child(2)')
    w.vm.clear(); await flushPromises()
    expect(popup()).not.toBeNull()
    expect(document.querySelector('.zt-select-box-panel__selection strong')?.textContent).toBe('0')
  })
  it.each([
    { modelValue: [], clearable: true },
    { modelValue: [0], clearable: true, disabled: true },
    { modelValue: [0], clearable: false },
  ])('has no clear button or clear side effects for %j', async props => {
    const w = box(props)
    expect(w.find('.zt-select-box__clear').exists()).toBe(false)
    w.vm.clear(); await flushPromises()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('change')).toBeUndefined()
    expect(w.emitted('clear')).toBeUndefined()
    expect(w.emitted('visible-change')).toBeUndefined()
  })
  it('invalidates pending keyword searches and reloads page one with an empty query while open', async () => {
    vi.useFakeTimers()
    const remoteMethod = vi.fn().mockResolvedValue({ mode: 'search', options, total: 25 } satisfies ZtSelectBoxRemoteResult)
    const w = box({ modelValue: [0], clearable: true, remote: true, remoteMethod, debounce: 100 })
    await open(w)
    await click('[aria-label="下一页"]')
    await w.findComponent(SelectBoxPanel).get('input[aria-label="搜索选项"]').setValue('pending')
    w.vm.clear(); await flushPromises()
    await vi.advanceTimersByTimeAsync(100)
    expect(remoteMethod.mock.calls.map(call => call[0])).toEqual([
      { mode: 'search', keyword: '', page: 1, pageSize: 10 },
      { mode: 'search', keyword: '', page: 2, pageSize: 10 },
      { mode: 'search', keyword: '', page: 1, pageSize: 10 },
    ])
    expect(popup()).not.toBeNull()
  })
})

describe('SelectBox configuration and Form integration', () => {
  it.each((['mini', 'small', 'default', 'medium', 'large'] as ZtComponentSize[]).flatMap(size =>
    (['light', 'dark'] as const).flatMap(theme => [0, 6, 16].map(borderRadius => ({ size, theme, borderRadius }))),
  ))('inherits nested configuration %j across the trigger and teleported controls', async config => {
    const w = mount(ZtConfigProvider, {
      attachTo: document.body,
      props: { size: config.size, theme: config.theme === 'dark' ? 'light' : 'dark', borderRadius: 20 },
      slots: { default: () => h(ZtConfigProvider, { theme: config.theme, borderRadius: config.borderRadius }, {
        default: () => h(ZtSelectBox, { options }),
      }) },
    })
    wrappers.push(w)
    const select = w.findComponent(ZtSelectBox)
    expect(select.classes()).toContain(`zt-select-box--${config.size}`)
    expect(select.attributes('style')).toContain(`--zt-radius: ${config.borderRadius}px`)
    expect(select.attributes('data-zt-theme')).toBe(config.theme)
    await open(select)
    expect(popup()?.style.getPropertyValue('--zt-radius')).toBe(`${config.borderRadius}px`)
    expect(popup()?.dataset.ztTheme).toBe(config.theme)
    expect(popup()?.style.getPropertyValue('--zt-surface')).toBe(config.theme === 'dark' ? '#343c49' : 'initial')
    expect(select.findComponent(SelectBoxPanel).classes()).toContain(`zt-select-box-panel--${config.size}`)
    expect(document.querySelector('.zt-select-box-panel__search')?.classList.contains(`zt-input--${config.size}`)).toBe(config.size !== 'default')
  })
  it('prefers explicit size over Form size and blocks every action when Form is disabled', async () => {
    const { w, select, controlProps } = form({ modelValue: [0] })
    expect(select.classes()).toContain('zt-select-box--small')
    controlProps.size = 'large'
    await flushPromises()
    expect(select.classes()).toContain('zt-select-box--large')
    await open(select)
    await w.setProps({ disabled: true })
    expect(popup()).toBeNull()
    expect(trigger(select).element.disabled).toBe(true)
    expect(select.find('.zt-select-box__clear').exists()).toBe(false)
    select.vm.clear(); select.vm.open(); await flushPromises()
    expect(select.emitted('change')).toBeUndefined()
    expect(popup()).toBeNull()
  })
  it('merges error descriptions and clears change errors on confirmation', async () => {
    const { w, select } = form()
    await w.vm.validate().catch(() => {})
    await flushPromises()
    const id = trigger(select).attributes('id')
    expect(trigger(select).attributes('aria-describedby')).toBe(`region-hint ${id}-error`)
    expect(select.classes()).toContain('is-error')
    await open(select)
    await click('.zt-select-box-panel__option')
    expect(trigger(select).attributes('aria-invalid')).toBe('true')
    await click('.zt-select-box-panel__confirm')
    expect(trigger(select).attributes('aria-invalid')).toBeUndefined()
    expect(trigger(select).attributes('aria-describedby')).toBe('region-hint')
  })
  it('validates blur once only after focus leaves the popup and keeps outside focus', async () => {
    const { w, select } = form({}, 'blur')
    await open(select)
    await click('.zt-select-box-panel__mode')
    expect(select.emitted('blur')).toBeUndefined()
    expect(w.findComponent(ZtFormItem).classes()).not.toContain('is-error')
    const target = outside()
    target.focus(); await flushPromises()
    expect(select.emitted('blur')).toHaveLength(1)
    expect(w.findComponent(ZtFormItem).classes()).toContain('is-error')
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(target)
  })
  it('owns focus in nested teleported Select branches, including direct departure from them', async () => {
    const { w, select } = form({}, 'blur')
    await open(select)
    await click('.zt-select-box-panel__mode')
    const nested = document.querySelector<HTMLElement>('.zt-select-box-panel__separator [role="combobox"]')!
    nested.focus(); nested.click(); await flushPromises()
    const branch = document.querySelector<HTMLElement>('[role="listbox"]')!
    branch.tabIndex = -1
    branch.focus(); await flushPromises()
    expect(select.emitted('blur')).toBeUndefined()
    expect(w.findComponent(ZtFormItem).classes()).not.toContain('is-error')
    const target = outside()
    target.focus(); await flushPromises()
    expect(select.emitted('blur')).toHaveLength(1)
    expect(w.findComponent(ZtFormItem).classes()).toContain('is-error')
    expect(popup()).toBeNull()
    expect(document.activeElement).toBe(target)
  })
  it('does not validate blur on cancel, confirmation, or clear focus restoration', async () => {
    const { w, select } = form({ modelValue: [0] }, 'blur')
    await open(select)
    select.vm.clear(); await flushPromises()
    expect(document.activeElement).toBe(trigger(select).element)
    expect(popup()).not.toBeNull()
    await click('.zt-select-box-panel__cancel')
    expect(select.emitted('blur')).toBeUndefined()
    expect(w.findComponent(ZtFormItem).classes()).not.toContain('is-error')
    await open(select)
    await click('.zt-select-box-panel__confirm')
    expect(select.emitted('blur')).toBeUndefined()
    expect(w.findComponent(ZtFormItem).classes()).not.toContain('is-error')
  })
})


describe('SelectBox underline boundary', () => {
  it('marks the trigger only through search, pagination, and batch mode', async () => {
    const { w, select } = form({ modelValue: [0, 1] })
    await w.setProps({ underline: true })
    expect(select.classes()).toContain('is-form-underline')
    expect(select.get('.zt-select-box__summary').text()).toBe('选项 0, 选项 1')
    await open(select)
    expect(popup()!.querySelector('.zt-input')).not.toBeNull()
    expect(popup()!.querySelector('.zt-select')).not.toBeNull()
    expect(popup()!.querySelector('.is-form-underline')).toBeNull()
    await click('.zt-select-box-panel__mode')
    expect(popup()!.querySelector('textarea')).not.toBeNull()
    expect(popup()!.querySelector('.zt-select-box-panel__separator .zt-select')).not.toBeNull()
    expect(popup()!.querySelector('.is-form-underline')).toBeNull()
  })
})
