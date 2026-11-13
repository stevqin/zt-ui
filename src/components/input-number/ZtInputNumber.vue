<script setup lang="ts">
import { useFormControlAppearance } from '../form/useFormControlAppearance'
import { useZtSize } from '../config-provider/context'
import { toRef, computed, inject, ref, useAttrs, watch } from 'vue'
import { ztFormItemKey } from '../form/context'
import type { ZtInputNumberProps } from './types'
import './input-number.scss'

defineOptions({ name: 'ZtInputNumber', inheritAttrs: false })

const props = withDefaults(defineProps<ZtInputNumberProps>(), {
  underline: undefined,
  modelValue: null,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  money: false,
  stepStrictly: false,
  disabled: false,
  readonly: false,
  controls: true,
  controlsPosition: 'default',
})
const { underline } = useFormControlAppearance(toRef(props, 'underline'))

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
const focused = ref(false)
const displayValue = ref(format(props.modelValue))
let lastInputValue: number | null | undefined

watch(() => props.modelValue, value => {
  // Preserve the draft and caret when v-model echoes a value from this field.
  if (props.money && focused.value && Object.is(value, lastInputValue)) return
  displayValue.value = format(value)
  lastInputValue = undefined
})
watch([() => props.money, () => props.precision], () => {
  displayValue.value = format(props.modelValue)
})

const classes = computed(() => [
  'zt-input-number',
  props.money && 'zt-input-number--money',
  underline.value && 'is-form-underline',
  effectiveSize.value !== 'default' && `zt-input-number--${effectiveSize.value}`,
  props.controlsPosition === 'left' && 'zt-input-number--controls-left',
  props.controlsPosition === 'right' && 'zt-input-number--controls-right',
  !props.controls && 'zt-input-number--without-controls',
  effectiveDisabled.value && 'is-disabled',
  props.readonly && 'is-readonly',
])
const effectiveSize = useZtSize(props, () => formItem?.size.value)
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

function effectivePrecision() {
  return props.precision ?? (props.money ? 2 : undefined)
}

function round(value: number) {
  const precision = effectivePrecision() ?? Math.min(12, Math.max(decimals(value), decimals(props.step)))
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
  const precision = effectivePrecision()
  if (props.money) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value)
  }
  return precision == null ? String(value) : value.toFixed(precision)
}

function parse(raw: string) {
  if (!props.money) return Number(raw)
  const amount = raw.trim().replace(/^([+-]?)[¥￥]\s*/, '$1')
  // Accept plain decimals or correctly grouped amounts copied from a display.
  if (!/^[+-]?(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?|\.\d+)$/.test(amount)) return NaN
  return Number(amount.replace(/,/g, ''))
}

function handleFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  focused.value = false
  if (props.money && displayValue.value.trim() !== '') {
    const value = parse(displayValue.value)
    displayValue.value = format(Number.isFinite(value) ? value : props.modelValue)
  }
  emit('blur', event)
  void formItem?.validate('blur')
}

function emitInput(value: number | null) {
  lastInputValue = value
  emit('update:modelValue', value)
  emit('input', value)
}

function emitInputWhenChanged(value: number | null) {
  if (!Object.is(lastInputValue, value)) emitInput(value)
}

function groupMoneyDraft(input: HTMLInputElement, inputType: string) {
  let raw = input.value
  let caret = input.selectionStart ?? raw.length

  // Deleting only an auto-inserted comma should delete the adjacent digit.
  const previous = displayValue.value
  if (previous[caret] === ',' && raw === previous.slice(0, caret) + previous.slice(caret + 1)) {
    if (inputType === 'deleteContentBackward') {
      raw = raw.slice(0, caret - 1) + raw.slice(caret)
      caret--
    } else if (inputType === 'deleteContentForward') {
      raw = raw.slice(0, caret) + raw.slice(caret + 1)
    }
  }

  const amount = raw.trim().replace(/^([+-]?)[¥￥]\s*/, '$1')
  // Existing separators can be misplaced after editing in the middle.
  const isDigitEdit = inputType === 'insertText' || inputType.startsWith('deleteContent')
  if (!isDigitEdit && !Number.isFinite(parse(raw))) return raw
  const draft = amount.replace(/,/g, '')
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(draft)) return raw

  const [integer, fraction] = draft.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = fraction === undefined ? grouped : grouped + '.' + fraction

  if (formatted !== input.value) {
    // Track the caret by digits, sign and decimal point, ignoring formatting.
    let remaining = raw.slice(0, caret).replace(/[^0-9.+-]/g, '').length
    let position = 0
    while (remaining > 0 && position < formatted.length) {
      if (formatted[position++] !== ',') remaining--
    }
    if (raw[caret - 1] === ',' && formatted[position] === ',') position++
    input.value = formatted
    input.setSelectionRange(position, position)
  }
  return formatted
}

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = props.money ? groupMoneyDraft(input, (event as InputEvent).inputType ?? '') : input.value
  displayValue.value = raw
  if (raw.trim() === '') {
    emitInput(null)
    void formItem?.validate('change')
    return
  }
  const value = parse(raw)
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
  const parsed = parse(displayValue.value)
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
      @focus="handleFocus"
      @blur="handleBlur"
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
