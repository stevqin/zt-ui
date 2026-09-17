import { h, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ZtForm, ZtFormGroup, ZtFormItem, ZtInput, ZtInputNumber } from '../src'
import type { ZtFormInstance, ZtFormRules } from '../src'

function mountNameForm(
  model: Record<string, unknown>,
  rules: ZtFormRules = {},
  itemProps: Record<string, unknown> = {},
) {
  return mount(ZtForm, {
    props: { model, rules },
    global: { stubs: { teleport: true } },
    slots: {
      default: () => h(ZtFormItem, { label: '名称', prop: 'user.name', ...itemProps }, {
        default: () => h(ZtInput, {
          modelValue: (model.user as Record<string, unknown>).name as string,
          'onUpdate:modelValue': (value: string) => { (model.user as Record<string, unknown>).name = value },
        }),
      }),
    },
  })
}

function formApi(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as ZtFormInstance
}

describe('ZtForm validation', () => {
  it('registers nested fields, merges rules and exposes validation results', async () => {
    const model = { user: { name: '' } }
    const wrapper = mountNameForm(model, {
      'user.name': { required: true, message: '请输入名称' },
    })

    await expect(formApi(wrapper).validate()).rejects.toEqual({ 'user.name': ['请输入名称'] })
    expect(wrapper.get('.zt-form-item__error').text()).toBe('请输入名称')
    expect(wrapper.get('.zt-form-item').classes()).toContain('is-error')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')

    model.user.name = 'Zt UI'
    await expect(formApi(wrapper).validate()).resolves.toBe(true)
    expect(wrapper.find('.zt-form-item__error').exists()).toBe(false)
  })

  it('supports local required rules and externally supplied errors', async () => {
    const required = mountNameForm({ user: { name: '' } }, {}, { required: true })
    await expect(formApi(required).validateField('user.name')).rejects.toMatchObject({ 'user.name': [expect.any(String)] })

    const external = mountNameForm({ user: { name: 'Zt UI' } }, {}, { error: '服务端校验失败' })
    expect(external.get('.zt-form-item__error').text()).toBe('服务端校验失败')
  })

  it('renders validation messages as an anchored tooltip without changing item height', () => {
    const wrapper = mountNameForm(
      { user: { name: '' } },
      {},
      { error: '漂浮错误消息' },
    )
    const error = wrapper.get<HTMLElement>('.zt-form-item__error')

    expect(wrapper.get('.zt-form-item__error-indicator').attributes('aria-label')).toBe('查看错误信息')
    expect(error.attributes('role')).toBe('alert')
    expect(error.classes()).toContain('is-visible')
    expect(error.element.style.position).toBe('fixed')
    expect(error.element.style.pointerEvents).toBe('none')
  })

  it('reveals the error tooltip for field focus and error indicator hover', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mountNameForm(
        { user: { name: '' } },
        {},
        { error: '服务端校验失败' },
      )
      const error = () => wrapper.get('.zt-form-item__error')
      const indicator = wrapper.get('.zt-form-item__error-indicator')

      await vi.advanceTimersByTimeAsync(2600)
      expect(error().classes()).not.toContain('is-visible')

      await wrapper.get('input').trigger('focusin')
      expect(error().classes()).toContain('is-visible')
      await wrapper.get('input').trigger('focusout')
      expect(error().classes()).not.toContain('is-visible')

      await indicator.trigger('mouseenter')
      expect(error().classes()).toContain('is-visible')
      await indicator.trigger('mouseleave')
      expect(error().classes()).not.toContain('is-visible')
    } finally {
      vi.useRealTimers()
    }
  })

  it('resets initial values and clears selected validation state', async () => {
    const model = { user: { name: '初始名称' } }
    const wrapper = mountNameForm(model, { 'user.name': { min: 5, message: '至少五个字符' } })
    model.user.name = '短'
    await expect(formApi(wrapper).validate()).rejects.toBeDefined()

    formApi(wrapper).clearValidate('user.name')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.zt-form-item__error').exists()).toBe(false)

    formApi(wrapper).resetFields('user.name')
    expect(model.user.name).toBe('初始名称')
  })

  it('scrolls to a registered field and scrolls to the first invalid field on request', async () => {
    const scrollIntoView = vi.fn()
    const original = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    const wrapper = mount(ZtForm, {
      props: { model: { name: '' }, rules: { name: { required: true } }, scrollToError: true },
      slots: { default: () => h(ZtFormItem, { label: '名称', prop: 'name' }, () => h('input')) },
    })

    formApi(wrapper).scrollToField('name')
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    await expect(formApi(wrapper).validate()).rejects.toBeDefined()
    expect(scrollIntoView).toHaveBeenCalledTimes(2)
    HTMLElement.prototype.scrollIntoView = original
  })

  it('validates text inputs on blur and clears errors after a valid change', async () => {
    const model = { user: { name: '' } }
    const wrapper = mountNameForm(model, {
      'user.name': [
        { required: true, trigger: 'blur', message: '请输入名称' },
        { min: 3, trigger: 'change', message: '至少三个字符' },
      ],
    })
    const input = wrapper.get('input')

    await input.trigger('blur')
    await vi.waitFor(() => expect(wrapper.get('.zt-form-item__error').text()).toBe('请输入名称'))

    await input.setValue('Zt UI')
    await vi.waitFor(() => expect(wrapper.find('.zt-form-item__error').exists()).toBe(false))
  })

  it('validates number controls after stepping', async () => {
    const model = reactive({ quantity: 1 })
    const wrapper = mount(ZtForm, {
      global: { stubs: { teleport: true } },
      props: { model, rules: { quantity: { min: 3, trigger: 'change', message: '至少为 3' } } },
      slots: {
        default: () => h(ZtFormItem, { prop: 'quantity' }, () => h(ZtInputNumber, {
          modelValue: model.quantity,
          'onUpdate:modelValue': (value: number | null) => { model.quantity = value ?? 0 },
        })),
      },
    })

    await wrapper.get('[aria-label="增加数值"]').trigger('click')
    await vi.waitFor(() => expect(wrapper.get('.zt-form-item__error').text()).toBe('至少为 3'))
    await wrapper.get('[aria-label="增加数值"]').trigger('click')
    await vi.waitFor(() => expect(wrapper.find('.zt-form-item__error').exists()).toBe(false))
  })
})

describe('ZtForm layout', () => {
  it('inherits size and disabled state and renders label layout classes', () => {
    const wrapper = mount(ZtForm, {
      props: { model: { name: '' }, size: 'mini', disabled: true, inline: true, labelPosition: 'top' },
      slots: { default: () => h(ZtFormItem, { label: '名称', prop: 'name' }, () => h(ZtInput)) },
    })

    expect(wrapper.classes()).toContain('zt-form--inline')
    expect(wrapper.classes()).toContain('zt-form--label-top')
    expect(wrapper.classes()).toContain('zt-form--mini')
    expect(wrapper.get('.zt-input').classes()).toContain('zt-input--mini')
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })

  it('renders a semantic optional form group', () => {
    const wrapper = mount(ZtFormGroup, {
      props: { title: '基本信息', description: '请填写真实信息', bordered: true },
      slots: { default: '<input name="name">' },
    })

    expect(wrapper.element.tagName).toBe('FIELDSET')
    expect(wrapper.get('legend').text()).toBe('基本信息')
    expect(wrapper.get('.zt-form-group__description').text()).toBe('请填写真实信息')
    expect(wrapper.classes()).toContain('zt-form-group--bordered')
  })
})
