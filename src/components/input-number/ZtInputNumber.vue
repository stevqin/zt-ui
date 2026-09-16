<script setup lang="ts">
import { computed, inject, ref, useAttrs, watch } from 'vue'
import { ztFormItemKey } from '../form/context'
import type { ZtInputNumberProps } from './types'
import './input-number.scss'

defineOptions({ name: 'ZtInputNumber', inheritAttrs: false })

const props = withDefaults(defineProps<ZtInputNumberProps>(), {
  modelValue: null,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  stepStrictly: false,
  disabled: false,
  readonly: false,
  controls: true,
  controlsPosition: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  input: [value: number | null]
  change: [value: number | null, oldValue: number | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const formItem = inject(ztFormItemKey, undefined)
const inputRef = ref<HTMLInputElement>()
const displayValue = ref(format(props.modelValue))
let lastInputValue: number | null | undefined

watch(() => props.modelValue, value => {
  displayValue.value = format(value)
  lastInputValue = undefined
})

const classes = computed(() => [
  'zt-input-number',
  effectiveSize.value !== 'default' && `zt-input-number--${effectiveSize.value}`,
  props.controlsPosition === 'left' && 'zt-input-number--controls-left',
  props.controlsPosition === 'right' && 'zt-input-number--controls-right',
  !props.controls && 'zt-input-number--without-controls',
  effectiveDisabled.value && 'is-disabled',
  props.readonly && 'is-readonly',
])
const effectiveSize = computed(() => props.size ?? formItem?.size.value ?? 'default')
const effectiveDisabled = computed(() => props.disabled || formItem?.disabled.value || false)
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const describedBy = computed(() => {
  const own = attrs['aria-describedby']
  return typeof own === 'string' ? own : formItem?.validateMessage.value ? formItem.errorId : undefined
})
const decreaseDisabled = computed(() => effectiveDisabled.value || props.readonly || (props.modelValue != null && props.modelValue <= props.min))
const increaseDisabled = computed(() => effectiveDisabled.value || props.readonly || (props.modelValue != null && props.modelValue >= props.max))

function decimals(value: number) {
  const source = String(value).toLowerCase()
  if (source.includes('e-')) return Number(source.split('e-')[1]) || 0
  return source.includes('.') ? source.length - source.indexOf('.') - 1 : 0
}

function round(value: number) {
  const precision = props.precision ?? Math.min(12, Math.max(decimals(value), decimals(props.step)))
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

function normalize(value: number) {
  let next = value
  if (props.stepStrictly && props.step > 0) {
    const base = Number.isFinite(props.min) ? props.min : 0
    next = base + Math.round((next - base) / props.step) * props.step
  }
  next = Math.min(props.max, Math.max(props.min, next))
  return round(next)
}

function format(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return ''
  return props.precision == null ? String(value) : value.toFixed(props.precision)
}

function emitInput(value: number | null) {
  lastInputValue = value
  emit('update:modelValue', value)
  emit('input', value)
}

function emitInputWhenChanged(value: number | null) {
  if (!Object.is(lastInputValue, value)) emitInput(value)
}

function handleInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  displayValue.value = raw
  if (raw.trim() === '') {
    emitInput(null)
    void formItem?.validate('change')
    return
  }
  const value = Number(raw)
  if (Number.isFinite(value)) {
    emitInput(value)
    void formItem?.validate('change')
  }
}

function commit() {
  const oldValue = props.modelValue ?? null
  if (displayValue.value.trim() === '') {
    displayValue.value = ''
    emitInputWhenChanged(null)
    emit('change', null, oldValue)
    return
  }
  const parsed = Number(displayValue.value)
  const next = Number.isFinite(parsed) ? normalize(parsed) : oldValue
  displayValue.value = format(next)
  emitInputWhenChanged(next)
  emit('change', next, oldValue)
  void formItem?.validate('change')
}

function stepBy(direction: 1 | -1) {
  if (effectiveDisabled.value || props.readonly) return
  const oldValue = props.modelValue ?? null
  const base = oldValue ?? (Number.isFinite(props.min) ? props.min : 0)
  const next = normalize(base + props.step * direction)
  displayValue.value = format(next)
  emitInput(next)
  emit('change', next, oldValue)
  void formItem?.validate('change')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    stepBy(1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    stepBy(-1)
  }
}

defineExpose({
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
})
</script>

<template>
  <div :class="[classes, attrs.class]" :style="attrs.style">
    <button
      v-if="controls"
      type="button"
      class="zt-input-number__control zt-input-number__decrease"
      aria-label="减少数值"
      :disabled="decreaseDisabled"
      tabindex="-1"
      @click="stepBy(-1)"
    >−</button>
    <input
      ref="inputRef"
      class="zt-input-number__inner"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :value="displayValue"
      v-bind="inputAttrs"
      :id="String(attrs.id ?? formItem?.inputId ?? '') || undefined"
      :disabled="effectiveDisabled"
      :readonly="readonly"
      :aria-valuemin="Number.isFinite(min) ? min : undefined"
      :aria-valuemax="Number.isFinite(max) ? max : undefined"
      :aria-valuenow="modelValue == null ? undefined : modelValue"
      :aria-invalid="formItem?.validateState.value === 'error' ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="handleInput"
      @change="commit"
      @keydown="handleKeydown"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event); formItem?.validate('blur')"
    >
    <button
      v-if="controls"
      type="button"
      class="zt-input-number__control zt-input-number__increase"
      aria-label="增加数值"
      :disabled="increaseDisabled"
      tabindex="-1"
      @click="stepBy(1)"
    >+</button>
  </div>
</template>
