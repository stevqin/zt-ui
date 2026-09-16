<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, provide } from 'vue'
import type { ZtFormContext, ZtFormFieldContext } from './context'
import { ztFormKey } from './context'
import type { ZtFormProps, ZtFormValidationErrors } from './types'
import './form.scss'

defineOptions({ name: 'ZtForm', inheritAttrs: false })

const props = withDefaults(defineProps<ZtFormProps>(), {
  model: () => ({}),
  rules: () => ({}),
  disabled: false,
  inline: false,
  labelPosition: 'right',
  labelWidth: 'auto',
  hideRequiredAsterisk: false,
  showMessage: true,
  scrollToError: false,
})
const configSize = useZtSize(props)


const emit = defineEmits<{
  validate: [prop: string, valid: boolean, message: string]
}>()

const fields = new Set<ZtFormFieldContext>()
const classes = computed(() => [
  'zt-form',
  `zt-form--label-${props.labelPosition}`,
  props.inline && 'zt-form--inline',
  configSize.value !== 'default' && `zt-form--${configSize.value}`,
  props.disabled && 'is-disabled',
])

function addField(field: ZtFormFieldContext) {
  fields.add(field)
}

function removeField(field: ZtFormFieldContext) {
  fields.delete(field)
}

function notifyValidate(prop: string, valid: boolean, message: string) {
  emit('validate', prop, valid, message)
}

provide<ZtFormContext>(ztFormKey, {
  model: props.model,
  rules: computed(() => props.rules),
  size: computed(() => configSize.value),
  disabled: computed(() => props.disabled),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  hideRequiredAsterisk: computed(() => props.hideRequiredAsterisk),
  showMessage: computed(() => props.showMessage),
  addField,
  removeField,
  notifyValidate,
})

function selectedFields(selection?: string | string[]) {
  if (selection == null) return [...fields]
  const keys = new Set(Array.isArray(selection) ? selection : [selection])
  return [...fields].filter(field => keys.has(field.prop))
}

async function runValidation(selection?: string | string[]) {
  const targets = selectedFields(selection)
  const results = await Promise.all(targets.map(async field => ({ field, valid: await field.validate() })))
  const errors: ZtFormValidationErrors = {}
  for (const { field, valid } of results) {
    if (!valid) errors[field.prop] = [field.validateMessage.value]
  }
  if (Object.keys(errors).length) {
    if (props.scrollToError) results.find(result => !result.valid)?.field.element.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    throw errors
  }
  return true as const
}

function validate() {
  return runValidation()
}

function validateField(selection: string | string[]) {
  return runValidation(selection)
}

function resetFields(selection?: string | string[]) {
  selectedFields(selection).forEach(field => field.resetField())
}

function clearValidate(selection?: string | string[]) {
  selectedFields(selection).forEach(field => field.clearValidate())
}

function scrollToField(prop: string) {
  selectedFields(prop)[0]?.element.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

defineExpose({ validate, validateField, resetFields, clearValidate, scrollToField })
</script>

<template>
  <form :class="classes" v-bind="$attrs">
    <slot />
  </form>
</template>
