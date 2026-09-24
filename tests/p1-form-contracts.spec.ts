import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZtForm, ZtFormGroup, ZtFormItem } from '../src/components/form'
import { ZtSwitch } from '../src/components/switch'
import { ZtRadio, ZtRadioGroup } from '../src/components/radio'
import { ZtCheckbox, ZtCheckboxGroup } from '../src/components/checkbox'
import { ZtInput } from '../src/components/input'
import { ZtSlider } from '../src/components/slider'
import { ZtAutocomplete } from '../src/components/autocomplete'

describe('P1 form contracts', () => {
  it('Switch triggers change validation through Form rules', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtSwitch },
      setup() {
        const model = ref({ flag: false })
        const rules = { flag: [{ validator, trigger: 'change' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="flag"><ZtSwitch v-model="model.flag" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    await wrapper.find('.zt-switch').trigger('click')
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })

  it('RadioGroup triggers change validation', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtRadioGroup, ZtRadio },
      setup() {
        const model = ref({ pick: 'a' })
        const rules = { pick: [{ validator, trigger: 'change' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="pick"><ZtRadioGroup v-model="model.pick"><ZtRadio label="a">A</ZtRadio><ZtRadio label="b">B</ZtRadio></ZtRadioGroup></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1]!.setValue(true)
    await radios[1]!.trigger('change')
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })

  it('CheckboxGroup triggers change validation', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtCheckboxGroup, ZtCheckbox },
      setup() {
        const model = ref({ picks: [] as string[] })
        const rules = { picks: [{ validator, trigger: 'change' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="picks"><ZtCheckboxGroup v-model="model.picks"><ZtCheckbox value="a">A</ZtCheckbox></ZtCheckboxGroup></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })

  it('validates against the latest form model object after replacement', async () => {
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtInput },
      setup() {
        const model = ref<Record<string, unknown>>({ name: '' })
        const rules = {
          name: [{ required: true, message: 'required', trigger: 'change' as const }],
        }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="name"><ZtInput v-model="model.name" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    const vm = wrapper.vm as any
    // Replace the whole model object with a valid value.
    vm.model = { name: 'new' }
    await nextTick()
    const item = wrapper.findComponent(ZtFormItem)
    const ok = await (item.vm as any).validate()
    expect(ok).toBe(true)
  })

  it('FormGroup disabled disables Switch', async () => {
    const Host = defineComponent({
      components: { ZtFormGroup, ZtSwitch },
      setup() {
        const on = ref(false)
        return { on }
      },
      template: `<ZtFormGroup disabled><ZtSwitch v-model="on" /></ZtFormGroup>`,
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.zt-switch').classes()).toContain('is-disabled')
    await wrapper.find('.zt-switch').trigger('click')
    expect((wrapper.vm as any).on).toBe(false)
  })

  it('Slider validates on blur', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtSlider },
      setup() {
        const model = ref({ n: 10 })
        const rules = { n: [{ validator, trigger: 'blur' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="n"><ZtSlider v-model="model.n" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    await wrapper.find('.zt-slider').trigger('focusout')
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })

  it('Input validates on native change not every keystroke', async () => {
    const validator = vi.fn(() => true)
    const Host = defineComponent({
      components: { ZtForm, ZtFormItem, ZtInput },
      setup() {
        const model = ref({ name: '' })
        const rules = { name: [{ validator, trigger: 'change' as const }] }
        return { model, rules }
      },
      template: `<ZtForm :model="model" :rules="rules"><ZtFormItem prop="name"><ZtInput v-model="model.name" /></ZtFormItem></ZtForm>`,
    })
    const wrapper = mount(Host)
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).value = 'a'
    await input.trigger('input')
    expect(validator).not.toHaveBeenCalled()
    await input.trigger('change')
    await nextTick()
    expect(validator).toHaveBeenCalled()
  })

  it('Autocomplete emits change on commit path only', async () => {
    const Host = defineComponent({
      components: { ZtAutocomplete },
      setup() {
        const q = ref('')
        return { q }
      },
      template: `<ZtAutocomplete v-model="q" :options="[{label:'a',value:'a'}]" />`,
    })
    const wrapper = mount(Host)
    const ac = wrapper.findComponent(ZtAutocomplete)
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).value = 'x'
    await input.trigger('input')
    expect(ac.emitted('change')).toBeUndefined()
    await input.trigger('change')
    expect(ac.emitted('change')?.[0]).toEqual(['x'])
  })
})
