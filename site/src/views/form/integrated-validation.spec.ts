import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  ZtCheckboxGroup,
  ZtDatePicker,
  ZtDateTimePicker,
  ZtInput,
  ZtInputNumber,
  ZtInputOtp,
  ZtPassword,
  ZtRadioGroup,
  ZtSelect,
  ZtSlider,
  ZtSwitch,
  ZtUpload,
} from '@ztechjs/zt-ui'
import IntegratedValidation from './IntegratedValidation.vue'
import FormIndex from './Index.vue'

const settle = async () => {
  for (let index = 0; index < 12; index += 1) await nextTick()
}

describe('Form integrated validation example', () => {
  it('is presented as the primary scenario on the Form documentation page', () => {
    const wrapper = mount(FormIndex)

    expect(wrapper.findComponent(IntegratedValidation).exists()).toBe(true)
    expect(wrapper.get('h3').text()).toBe('全组件校验场景')
  })

  it('contains every developed data-entry control', () => {
    const wrapper = mount(IntegratedValidation)

    for (const component of [
      ZtInput,
      ZtPassword,
      ZtInputNumber,
      ZtRadioGroup,
      ZtCheckboxGroup,
      ZtSwitch,
      ZtSlider,
      ZtSelect,
      ZtDatePicker,
      ZtDateTimePicker,
      ZtInputOtp,
      ZtUpload,
    ]) expect(wrapper.findComponent(component).exists()).toBe(true)
  })

  it('shows every field rule when the empty example is submitted', async () => {
    const wrapper = mount(IntegratedValidation, { attachTo: document.body })

    await wrapper.get('[data-action="validate-all"]').trigger('click')
    await settle()

    expect(wrapper.findAll('.zt-form-item.is-error')).toHaveLength(13)
    expect(wrapper.get('[role="status"]').text()).toContain('13 个字段需要处理')
    wrapper.unmount()
  })

  it('resets the validation result and model', async () => {
    const wrapper = mount(IntegratedValidation, { attachTo: document.body })
    await wrapper.get('[data-action="validate-all"]').trigger('click')
    await settle()

    await wrapper.get('[data-action="reset"]').trigger('click')
    await settle()

    expect(wrapper.findAll('.zt-form-item.is-error')).toHaveLength(0)
    expect(wrapper.get('[role="status"]').text()).toContain('已恢复初始值')
    wrapper.unmount()
  })
})
