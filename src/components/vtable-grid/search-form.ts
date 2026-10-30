import { computed, defineComponent, h, onBeforeUnmount, ref, watch, type Component, type PropType, type VNodeChild } from 'vue'
import ZtForm from '../form/ZtForm.vue'
import ZtFormItem from '../form/ZtFormItem.vue'
import ZtInput from '../input/ZtInput.vue'
import ZtPassword from '../input/ZtPassword.vue'
import ZtInputNumber from '../input-number/ZtInputNumber.vue'
import ZtSelect from '../select/ZtSelect.vue'
import ZtButton from '../button/ZtButton.vue'
import ZtCheckbox from '../checkbox/ZtCheckbox.vue'
import ZtCheckboxGroup from '../checkbox/ZtCheckboxGroup.vue'
import ZtRadio from '../radio/ZtRadio.vue'
import ZtRadioGroup from '../radio/ZtRadioGroup.vue'
import ZtSwitch from '../switch/ZtSwitch.vue'
import ZtDatePicker from '../date-picker/ZtDatePicker.vue'
import ZtDateTimePicker from '../date-picker/ZtDateTimePicker.vue'
import ZtTimeSelect from '../time-select/ZtTimeSelect.vue'
import { getPathValue, setPathValue } from '../form/path'
import type { ZtFormInstance } from '../form/types'
import type { ZtComponentSize } from '../types'
import type { ZtVTableGridFormConfig, ZtVTableGridFormItem, ZtVTableGridFormScope } from './form-types'
import { createGridOptionLoader, type ZtVTableGridOption, type ZtVTableGridOptionCache, type ZtVTableGridOptionLoader } from './option-loader'

const controls: Record<string, Component> = { ZtInput, ZtPassword, ZtInputNumber, ZtSelect, ZtButton, ZtCheckbox, ZtCheckboxGroup, ZtRadio, ZtRadioGroup, ZtSwitch, ZtDatePicker, ZtDateTimePicker, ZtTimeSelect }
const aliases: Record<string, string> = { VxeInput: 'ZtInput', VxePasswordInput: 'ZtPassword', VxeNumberInput: 'ZtInputNumber', VxeSelect: 'ZtSelect', VxeButton: 'ZtButton', VxeButtonGroup: 'ZtButtonGroup', VxeCheckbox: 'ZtCheckbox', VxeCheckboxGroup: 'ZtCheckboxGroup', VxeRadio: 'ZtRadio', VxeRadioGroup: 'ZtRadioGroup', VxeSwitch: 'ZtSwitch', VxeDatePicker: 'ZtDatePicker', VxeDateRangePicker: 'ZtDatePicker', VxeTextarea: 'textarea' }
const width = (value?: string | number) => typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) ? Number(value) : value

export default defineComponent({
  name: 'ZtVTableGridSearchForm',
  props: {
    config: { type: Object as PropType<ZtVTableGridFormConfig>, required: true },
    model: Object as PropType<Record<string, unknown>>,
    size: { type: String as PropType<ZtComponentSize>, default: 'default' },
    disabled: Boolean,
    optionLoader: [Function, Object] as PropType<ZtVTableGridOptionLoader | ZtVTableGridOptionCache>,
  },
  emits: ['submit', 'reset', 'option-error'],
  setup(props, { slots, emit, expose }) {
    const form = ref<ZtFormInstance>()
    const fallback = {}
    const model = computed(() => props.model ?? props.config.data ?? fallback)
    const epoch = ref(0)
    watch(model, () => { epoch.value++ })
    const collapsed = ref(props.config.collapseStatus ?? true)
    watch(() => props.config.collapseStatus, value => { collapsed.value = value ?? true })
    const api: ZtFormInstance = {
      validate: () => form.value!.validate(), validateField: fields => form.value!.validateField(fields),
      resetFields: fields => form.value?.resetFields(fields), clearValidate: fields => form.value?.clearValidate(fields),
      scrollToField: field => form.value?.scrollToField(field),
    }
    expose(api)
    const scope = (item: ZtVTableGridFormItem): ZtVTableGridFormScope => ({ data: model.value, field: item.field, property: item.field, item, $form: api })
    const options = ref<Record<string, ZtVTableGridOption[]>>({})
    const loading = ref<Record<string, boolean>>({})
    let owned: ZtVTableGridOptionCache | undefined
    let generation = 0
    watch(() => [props.optionLoader, ...(props.config.items ?? []).map(item => item.optionSource ?? item.itemRender?.optionSource)], () => {
      const current = ++generation
      owned?.dispose(); owned = undefined
      options.value = {}; loading.value = {}
      const cache = typeof props.optionLoader === 'function' ? (owned = createGridOptionLoader(props.optionLoader)) : props.optionLoader
      if (!cache) return
      for (const source of new Set((props.config.items ?? []).map(item => item.optionSource ?? item.itemRender?.optionSource).filter((source): source is string => Boolean(source)))) {
        loading.value[source] = true
        cache.load(source).then(result => { if (current === generation) options.value[source] = result }).catch(error => {
          if (current === generation && error?.name !== 'AbortError') emit('option-error', error, source)
        }).finally(() => { if (current === generation) loading.value[source] = false })
      }
    }, { immediate: true })
    onBeforeUnmount(() => { generation++; owned?.dispose() })
    const submitting = ref(false)
    const submit = async (event: Event) => {
      event.preventDefault()
      if (props.disabled || submitting.value) return
      submitting.value = true
      try { await api.validate(); emit('submit', model.value) } catch { /* Field validation renders its own errors. */ }
      finally { submitting.value = false }
    }
    const reset = (event: Event) => { event.preventDefault(); if (!props.disabled) { api.resetFields(); emit('reset', model.value) } }
    const renderControl = (item: ZtVTableGridFormItem): VNodeChild => {
      const renderer = item.itemRender
      if (!renderer) return item.field ? String(getPathValue(model.value, item.field) ?? '') : null
      const params = scope(item)
      if (renderer.render) return renderer.render(params)
      const controlProps = { ...renderer.attrs, ...renderer.props }
      let name = aliases[renderer.name ?? ''] ?? renderer.name ?? 'ZtInput'
      const temporal = ['date', 'daterange', 'month', 'monthrange', 'year', 'yearrange', 'datetime', 'datetimerange', 'time', 'week', 'quarter'].includes(String(controlProps.type))
      if (name === 'ZtInput' && temporal) name = 'ZtDatePicker'
      if (name === 'ZtInput' && controlProps.type === 'textarea') name = 'textarea'
      if (name === 'ZtDatePicker' && !renderer.component) {
        const type = String(controlProps.type ?? 'date')
        if (['week', 'quarter'].includes(type) || controlProps.multiple) throw new Error(`日期模式 ${type}${controlProps.multiple ? ' multiple' : ''} 需要自定义 component/render`)
        if (controlProps.valueFormat && !renderer.valueAdapter) throw new Error('valueFormat 需要 valueAdapter 或自定义 component/render')
        if (!['date', 'daterange', 'month', 'monthrange', 'year', 'yearrange', 'datetime', 'datetimerange', 'time'].includes(type)) throw new Error(`不支持的日期模式 ${type}`)
        if (type === 'datetime' || type === 'datetimerange') { name = 'ZtDateTimePicker'; controlProps.range = type === 'datetimerange' || controlProps.range; delete controlProps.type }
        else if (type === 'time') { name = 'ZtTimeSelect'; delete controlProps.type }
        delete controlProps.valueFormat
      }
      if (!renderer.component && ['ZtDateTimePicker', 'ZtTimeSelect'].includes(name)) {
        if (controlProps.multiple) throw new Error('multiple 需要自定义 component/render')
        if (name === 'ZtTimeSelect' && controlProps.range) throw new Error('时间范围需要自定义 component/render')
        if (controlProps.type && !['date', 'daterange', 'datetime', 'datetimerange', 'time'].includes(String(controlProps.type))) throw new Error(`不支持的日期模式 ${controlProps.type}`)
        if (controlProps.valueFormat && !renderer.valueAdapter) throw new Error('valueFormat 需要 valueAdapter 或自定义 component/render')
        delete controlProps.valueFormat
      }
      if (renderer.name === 'VxeDateRangePicker') controlProps.range = true
      const disabled = props.disabled || Boolean(controlProps.disabled)
      const listeners = Object.fromEntries(Object.entries(renderer.events ?? {}).map(([event, handler]) => [`on${event[0]?.toUpperCase()}${event.slice(1)}`, (...args: unknown[]) => handler(scope(item), ...args)]))
      const source = item.optionSource ?? renderer.optionSource
      const rawOptions = source ? options.value[source] ?? [] : renderer.options ?? []
      const optionItems = rawOptions.map(option => ({ label: String((option as Record<string, unknown>)[renderer.optionProps?.label ?? 'label'] ?? ''), value: (option as Record<string, unknown>)[renderer.optionProps?.value ?? 'value'], disabled: Boolean(option.disabled) }))
      const button = (entry: Record<string, unknown>) => h(ZtButton, { ...entry, ...listeners, size: props.size, disabled, type: entry.type as 'button' | 'submit' | 'reset' ?? 'button' }, () => String(entry.content ?? renderer.content ?? ''))
      if (name === 'ZtButtonGroup') return h('div', (renderer.options ?? []).map(option => button(option as Record<string, unknown>)))
      if (name === 'ZtButton') return button(controlProps)
      const value = item.field ? getPathValue(model.value, item.field) : undefined
      const update = (value: unknown) => { if (!disabled && item.field) setPathValue(model.value, item.field, renderer.valueAdapter ? renderer.valueAdapter.fromControl(value) : value) }
      const controlValue = renderer.valueAdapter ? renderer.valueAdapter.toControl(value) : value
      if (name === 'textarea') return h('textarea', { ...controlProps, ...listeners, disabled, value: controlValue as string, onInput: (event: Event) => { update((event.target as HTMLTextAreaElement).value); renderer.events?.input?.(scope(item), event) } })
      const component = renderer.component ?? controls[name]
      if (!component) throw new Error(`不支持的表单控件 ${name}，请提供 component/render`)
      const children = name === 'ZtRadioGroup' || name === 'ZtCheckboxGroup' ? () => optionItems.map(option => h((name === 'ZtRadioGroup' ? ZtRadio : ZtCheckbox) as Component, { [name === 'ZtRadioGroup' ? 'label' : 'value']: option.value, disabled: option.disabled }, () => option.label)) : undefined
      return h(component, { ...controlProps, ...listeners, size: props.size, disabled: disabled || Boolean(source && loading.value[source]), modelValue: controlValue, ...(name === 'ZtSelect' ? { options: optionItems, noDataText: source && loading.value[source] ? '加载中…' : controlProps.noDataText } : {}), 'onUpdate:modelValue': update }, children)
    }
    return () => h(ZtForm, { ref: form, key: epoch.value, model: model.value, rules: props.config.rules, size: props.size, disabled: props.disabled, inline: props.config.inline ?? props.config.layout !== 'vertical', underline: props.config.underline ?? true, labelPosition: props.config.labelPosition ?? (props.config.vertical ? 'top' : props.config.titleAlign ?? 'right'), labelWidth: width(props.config.labelWidth ?? props.config.titleWidth) ?? 'auto', onSubmit: submit, onReset: reset, class: 'zt-vtable-grid__search-form' }, () => (props.config.items ?? []).map((item, index) => {
      const params = scope(item)
      if (item.visible === false || item.visibleMethod?.(params) === false) return null
      const span = item.span ?? props.config.span
      const slot = item.slots?.default
      return h(ZtFormItem, { key: item.field ?? index, prop: item.field, label: item.showTitle === false ? '' : `${item.title ?? ''}${item.title && (item.titleColon ?? props.config.titleColon) ? '：' : ''}`, labelWidth: width(item.titleWidth), labelPosition: item.vertical ? 'top' : item.titleAlign, rules: item.rules, class: typeof item.className === 'function' ? item.className(params) : item.className, style: { display: item.folding && collapsed.value ? 'none' : undefined, width: span ? `${Math.max(1, Math.min(span, 24)) / 24 * 100}%` : undefined, textAlign: item.align ?? props.config.align } }, () => [item.showContent === false ? null : typeof slot === 'string' ? slots[slot]?.(params) : typeof slot === 'function' ? slot(params) : renderControl(item), item.collapseNode ? h(ZtButton, { size: props.size, disabled: props.disabled, onClick: () => { collapsed.value = !collapsed.value } }, () => collapsed.value ? '展开' : '收起') : null])
    }))
  },
})
