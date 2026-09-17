<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject, nextTick, ref, useAttrs } from 'vue'
import { ztFormItemKey } from '../form/context'
import type { ZtInputProps } from './types'
import './input.scss'

defineOptions({ name: 'ZtInput', inheritAttrs: false })

const props = withDefaults(defineProps<ZtInputProps>(), {
  modelValue: '',
  type: 'text',
  status: 'default',
  disabled: false,
  readonly: false,
  autocomplete: undefined,
  clearable: false,
  showWordLimit: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const attrs = useAttrs()
const formItem = inject(ztFormItemKey, undefined)
const inputRef = ref<HTMLInputElement>()
const text = computed(() => props.modelValue == null ? '' : String(props.modelValue))
const effectiveSize = useZtSize(props, () => formItem?.size.value)
const effectiveDisabled = computed(() => props.disabled || formItem?.disabled.value || false)
const canClear = computed(() => props.clearable && text.value.length > 0 && !effectiveDisabled.value && !props.readonly)
const ariaInvalid = computed(() => props.status === 'error' || formItem?.validateState.value === 'error' ? 'true' : undefined)
const describedBy = computed(() => {
  const own = attrs['aria-describedby']
  return typeof own === 'string' ? own : formItem?.validateMessage.value ? formItem.errorId : undefined
})
const classes = computed(() => [
  'zt-input',
  effectiveSize.value !== 'default' && `zt-input--${effectiveSize.value}`,
  props.status !== 'default' && `zt-input--${props.status}`,
  effectiveDisabled.value && 'is-disabled',
  props.readonly && 'is-readonly',
  canClear.value && 'is-clearable',
])
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

function valueFrom(event: Event) {
  return (event.target as HTMLInputElement).value
}

function handleInput(event: Event) {
  const value = valueFrom(event)
  emit('update:modelValue', value)
  emit('input', value)
  void formItem?.validate('change')
}

function handleChange(event: Event) {
  emit('change', valueFrom(event))
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
  void formItem?.validate('blur')
}

async function clear() {
  if (!canClear.value) return
  emit('update:modelValue', '')
  emit('input', '')
  emit('change', '')
  emit('clear')
  void formItem?.validate('change')
  await nextTick()
  inputRef.value?.focus()
}

function focus(options?: FocusOptions) {
  inputRef.value?.focus(options)
}

function blur() {
  inputRef.value?.blur()
}

function select() {
  inputRef.value?.select()
}

defineExpose({ focus, blur, select, clear, input: inputRef })
</script>

<template>
  <div :class="[classes, attrs.class]" :style="attrs.style">
    <span v-if="$slots.prepend" class="zt-input__addon zt-input__prepend"><slot name="prepend" /></span>
    <span class="zt-input__wrapper">
      <span v-if="$slots.prefix" class="zt-input__prefix"><slot name="prefix" /></span>
      <input
        ref="inputRef"
        class="zt-input__inner"
        :type="type"
        :value="text"
        v-bind="inputAttrs"
        :id="String(attrs.id ?? formItem?.inputId ?? '') || undefined"
        :disabled="effectiveDisabled"
        :readonly="readonly"
        :autocomplete="props.autocomplete"
        :maxlength="maxlength"
        :aria-invalid="ariaInvalid"
        :aria-describedby="describedBy"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <span v-if="canClear" class="zt-input__clear-slot"><button type="button" class="zt-input__clear" aria-label="清空输入" @mousedown.prevent @click="clear">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8 8 8M16 8l-8 8" /></svg>
      </button></span>
      <span v-if="$slots.suffix || (showWordLimit && maxlength != null)" class="zt-input__suffix">
        <span v-if="showWordLimit && maxlength != null" class="zt-input__count">{{ text.length }} / {{ maxlength }}</span>
        <slot name="suffix" />
      </span>
    </span>
    <span v-if="$slots.append" class="zt-input__addon zt-input__append"><slot name="append" /></span>
  </div>
</template>
