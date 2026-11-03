import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { ZtForm, ZtFormItem, ZtInput } from '../src'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); document.body.innerHTML = '' })
function render(mode: string, itemMode?: string) {
  const wrapper = mount(ZtForm, { attachTo: document.body, props: { model: { name: '' }, messageDisplay: mode as never },
    slots: { default: () => h(ZtFormItem, { label: '姓名', prop: 'name', error: '请填写姓名', messageDisplay: itemMode as never }, () => h(ZtInput)) } })
  wrappers.push(wrapper)
  return wrapper
}

describe('form message display modes', () => {
  it('renders readable inline text without narrowing the control or adding a right icon', async () => {
    const w = render('inline')
    await nextTick()
    expect(w.find('.zt-form-item__error-indicator').exists()).toBe(false)
    const error = w.get('.zt-form-item__feedback-inline')
    expect(error.text()).toBe('请填写姓名')
    expect(w.get('input').attributes('aria-describedby')).toBe(error.attributes('id'))
    await w.setProps({ showMessage: false })
    expect(w.find('.zt-form-item__feedback-inline').exists()).toBe(false)
  })

  it('shows a lower popover only for the focused or hovered error field and allows Escape dismissal', async () => {
    const w = render('popover')
    await nextTick()
    expect(w.find('.zt-form-item__error-indicator').exists()).toBe(false)
    const popup = document.querySelector('.zt-form-item__error')!
    expect(popup.classList.contains('is-visible')).toBe(false)
    ;(w.get('input').element as HTMLInputElement).focus()
    await nextTick(); await nextTick()
    expect(popup.classList.contains('is-visible')).toBe(true)
    expect(popup.classList.contains('is-popover')).toBe(true)
    await w.get('input').trigger('keydown', { key: 'Escape' })
    expect(popup.classList.contains('is-visible')).toBe(false)
  })

  it('allows a field to override the form display mode', async () => {
    const w = render('popover', 'inline')
    await nextTick()
    expect(w.find('.zt-form-item__feedback-inline').exists()).toBe(true)
    expect(document.querySelector('.zt-form-item__error')).toBeNull()
  })

  it('summarizes errors, focuses the first invalid field and lets each summary entry locate its control', async () => {
    const model = reactive({ name: '', email: '' })
    const w = mount(ZtForm, { attachTo: document.body, props: { model, messageDisplay: 'summary', rules: {
      name: { required: true, message: '请填写姓名' }, email: { required: true, message: '请填写邮箱' },
    } }, slots: { default: () => ['name', 'email'].map((prop, i) => h(ZtFormItem, { label: i ? '邮箱' : '姓名', prop }, () => h(ZtInput, { modelValue: model[prop as keyof typeof model] }))) } })
    wrappers.push(w)
    await expect(w.vm.validate()).rejects.toHaveProperty('name')
    await flushPromises()
    const entries = w.findAll('.zt-form__summary-field')
    expect(entries).toHaveLength(2)
    expect(entries[0].text()).toContain('姓名')
    expect(entries[0].text()).toContain('请填写姓名')
    expect(document.activeElement).toBe(w.findAll('input')[0].element)
    await entries[1].trigger('click')
    expect(document.activeElement).toBe(w.findAll('input')[1].element)
    w.vm.clearValidate('name'); await nextTick()
    expect(w.findAll('.zt-form__summary-field')).toHaveLength(1)
    w.vm.resetFields(); await nextTick()
    expect(w.find('.zt-form__summary').exists()).toBe(false)
  })
})


describe('label-adjacent validation feedback', () => {
  it('keeps feedback outside the accessible label and uses normal document flow', async () => {
    const w = mount(ZtForm, { attachTo: document.body, props: { model: { name: '' }, messageDisplay: 'label' as never, labelPosition: 'top' },
      slots: { default: () => h(ZtFormItem, { label: '姓名', prop: 'name', error: '请填写姓名' }, () => h(ZtInput)) } })
    wrappers.push(w)
    await nextTick()
    const heading = w.get('.zt-form-item__heading')
    expect(heading.get('label').text()).toBe('姓名')
    const feedback = heading.get('.zt-form-item__feedback-label')
    expect(feedback.text()).toBe('请填写姓名')
    expect(w.get('input').attributes('aria-describedby')).toBe(feedback.attributes('id'))
    expect(w.find('.zt-form-item__error-indicator').exists()).toBe(false)
    expect(document.querySelector('.zt-form-item__error')).toBeNull()
    await w.setProps({ showMessage: false })
    expect(w.find('.zt-form-item__feedback-label').exists()).toBe(false)
  })

  it('places horizontal feedback in its own trailing column and clears its text without removing the column', async () => {
    const w = render('label')
    await nextTick()
    const feedback = w.get('.zt-form-item__content > .zt-form-item__feedback-label.is-side')
    expect(feedback.text()).toBe('请填写姓名')
    expect(w.get('input').attributes('aria-describedby')).toBe(feedback.attributes('id'))
    expect(w.find('.zt-form-item__heading').exists()).toBe(false)
    w.vm.clearValidate(); await nextTick()
    expect(w.get('.zt-form-item__feedback-label.is-side').text()).toBe('')
    expect(w.get('.zt-form-item__feedback-label.is-side').attributes('aria-hidden')).toBe('true')
    expect(w.get('input').attributes('aria-invalid')).not.toBe('true')
  })
})


it('retains the below-control fallback only for fields without labels', async () => {
  const w = mount(ZtForm, { attachTo: document.body, props: { model: { name: '' }, messageDisplay: 'label' }, slots: { default: () => h(ZtFormItem, { prop: 'name', error: '请填写姓名' }, () => h(ZtInput)) } })
  wrappers.push(w)
  expect(w.get('.zt-form-item__feedback-label.is-below').text()).toBe('请填写姓名')
  expect(w.find('.zt-form-item__feedback-label.is-side').exists()).toBe(false)
})
