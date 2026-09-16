<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { ztFormItemKey, ztFormKey } from './context'
import type { ZtFormFieldContext } from './context'
import { cloneFormValue, getPathValue, pathKey, setPathValue } from './path'
import type { ZtFormItemProps, ZtFormRule, ZtFormValidateTrigger } from './types'
import { validateValue } from './validation'

defineOptions({ name: 'ZtFormItem' })

const props = withDefaults(defineProps<ZtFormItemProps>(), {
  label: '',
  required: false,
})

const form = inject(ztFormKey, undefined)
const instance = getCurrentInstance()
const element = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()
const indicatorElement = ref<HTMLElement>()
const tooltipElement = ref<HTMLElement>()
const validateState = ref<ZtFormFieldContext['validateState']['value']>('')
const validateMessage = ref('')
const fieldFocused = ref(false)
const indicatorHovered = ref(false)
const autoTooltipVisible = ref(false)
const tooltipPlacement = ref<'left' | 'right'>('right')
const tooltipStyle = ref<CSSProperties>({ position: 'fixed', pointerEvents: 'none' })
const fieldKey = computed(() => props.prop == null ? '' : pathKey(props.prop))
const inputId = `zt-form-input-${instance?.uid ?? Math.random().toString(36).slice(2)}`
const errorId = `${inputId}-error`
const initialValue = cloneFormValue(props.prop != null && form ? getPathValue(form.model, props.prop) : undefined)
let validationRun = 0
let autoHideTimer: ReturnType<typeof setTimeout> | undefined

function list(value: ZtFormRule | ZtFormRule[] | undefined) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const rules = computed(() => {
  const merged = [...list(form?.rules.value[fieldKey.value]), ...list(props.rules)]
  if (props.required && !merged.some(rule => rule.required)) {
    merged.unshift({ required: true, message: props.label ? `请输入${props.label}` : '该字段为必填项' })
  }
  return merged
})
const isRequired = computed(() => props.required || rules.value.some(rule => rule.required))
const size = useZtSize(props, () => form?.size.value)
const disabled = computed(() => form?.disabled.value ?? false)
const hasOwnShowMessage = computed(() => {
  const vnodeProps = instance?.vnode.props
  return Boolean(vnodeProps && ('showMessage' in vnodeProps || 'show-message' in vnodeProps))
})
const showMessage = computed(() => hasOwnShowMessage.value ? props.showMessage : form?.showMessage.value ?? true)
const labelWidth = computed(() => props.labelWidth ?? form?.labelWidth.value ?? 'auto')
const labelStyle = computed<CSSProperties>(() => {
  if (form?.labelPosition.value === 'top' || labelWidth.value === 'auto') return {}
  return { width: typeof labelWidth.value === 'number' ? `${labelWidth.value}px` : labelWidth.value }
})
const classes = computed(() => [
  'zt-form-item',
  validateState.value && `is-${validateState.value}`,
  isRequired.value && 'is-required',
  size.value !== 'default' && `zt-form-item--${size.value}`,
])
const tooltipVisible = computed(() => Boolean(
  validateMessage.value
  && showMessage.value
  && (autoTooltipVisible.value || fieldFocused.value || indicatorHovered.value),
))

function clearAutoHideTimer() {
  if (autoHideTimer !== undefined) clearTimeout(autoHideTimer)
  autoHideTimer = undefined
}

function brieflyShowTooltip() {
  clearAutoHideTimer()
  autoTooltipVisible.value = true
  autoHideTimer = setTimeout(() => {
    autoTooltipVisible.value = false
    autoHideTimer = undefined
  }, 2500)
  void nextTick(updateTooltipPosition)
}

function updateTooltipPosition() {
  if (typeof window === 'undefined' || !tooltipVisible.value) return
  const anchor = indicatorElement.value?.getBoundingClientRect()
  const tooltip = tooltipElement.value?.getBoundingClientRect()
  if (!anchor || !tooltip) return

  const viewportPadding = 12
  const gap = 9
  const width = tooltip.width
  const height = tooltip.height
  let placement: 'left' | 'right' = 'right'
  let left = anchor.right + gap

  if (left + width > window.innerWidth - viewportPadding) {
    placement = 'left'
    left = anchor.left - gap - width
  }

  left = Math.min(Math.max(left, viewportPadding), Math.max(viewportPadding, window.innerWidth - width - viewportPadding))
  const top = Math.min(
    Math.max(anchor.top + (anchor.height - height) / 2, viewportPadding),
    Math.max(viewportPadding, window.innerHeight - height - viewportPadding),
  )

  tooltipPlacement.value = placement
  tooltipStyle.value = {
    position: 'fixed',
    pointerEvents: 'none',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
}

function handleFocusIn() {
  fieldFocused.value = true
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && contentElement.value?.contains(nextTarget)) return
  fieldFocused.value = false
}

function triggerRules(trigger?: ZtFormValidateTrigger) {
  if (!trigger) return rules.value
  return rules.value.filter(rule => {
    if (!rule.trigger) return true
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
    return triggers.includes(trigger)
  })
}

async function validate(trigger?: ZtFormValidateTrigger) {
  if (!form || !props.prop || !fieldKey.value) return true
  if (props.error) {
    validateState.value = 'error'
    validateMessage.value = props.error
    return false
  }
  const activeRules = triggerRules(trigger)
  if (!activeRules.length) return true
  const run = ++validationRun
  validateState.value = 'validating'
  const message = await validateValue(getPathValue(form.model, props.prop), activeRules, {
    trigger,
    model: form.model,
    field: fieldKey.value,
  })
  if (run !== validationRun) return !message
  validateMessage.value = message ?? ''
  validateState.value = message ? 'error' : 'success'
  form.notifyValidate(fieldKey.value, !message, message ?? '')
  return !message
}

function clearValidate() {
  validationRun += 1
  validateState.value = ''
  validateMessage.value = ''
}

function resetField() {
  if (form && props.prop) setPathValue(form.model, props.prop, cloneFormValue(initialValue))
  clearValidate()
}

const fieldContext: ZtFormFieldContext = {
  get prop() { return fieldKey.value },
  inputId,
  errorId,
  element,
  size,
  disabled,
  validateState,
  validateMessage,
  validate,
  resetField,
  clearValidate,
}

provide(ztFormItemKey, fieldContext)
onMounted(() => {
  if (fieldKey.value) form?.addField(fieldContext)
  window.addEventListener('resize', updateTooltipPosition)
  window.addEventListener('scroll', updateTooltipPosition, true)
})
onBeforeUnmount(() => {
  clearAutoHideTimer()
  window.removeEventListener('resize', updateTooltipPosition)
  window.removeEventListener('scroll', updateTooltipPosition, true)
  form?.removeField(fieldContext)
})

watch(() => props.error, value => {
  if (value) {
    validateState.value = 'error'
    validateMessage.value = value
  } else if (validateMessage.value) {
    clearValidate()
  }
}, { immediate: true })

watch(validateMessage, value => {
  if (value && showMessage.value) brieflyShowTooltip()
  else {
    clearAutoHideTimer()
    autoTooltipVisible.value = false
  }
}, { immediate: true })

watch(tooltipVisible, visible => {
  if (visible) void nextTick(updateTooltipPosition)
})

defineExpose({ validate, resetField, clearValidate, validateState, validateMessage })
</script>

<template>
  <div ref="element" :class="classes">
    <label v-if="label || $slots.label" class="zt-form-item__label" :for="inputId" :style="labelStyle">
      <span v-if="isRequired && !form?.hideRequiredAsterisk.value" class="zt-form-item__required" aria-hidden="true">*</span>
      <slot name="label" :label="label">{{ label }}</slot>
    </label>
    <div ref="contentElement" class="zt-form-item__content" @focusin="handleFocusIn" @focusout="handleFocusOut">
      <slot />
      <template v-if="validateMessage && showMessage">
        <button
          ref="indicatorElement"
          type="button"
          class="zt-form-item__error-indicator"
          aria-label="查看错误信息"
          :aria-describedby="errorId"
          :aria-expanded="tooltipVisible"
          @mouseenter="indicatorHovered = true"
          @mouseleave="indicatorHovered = false"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 5.8v5.1M10 14.2h.01" />
          </svg>
        </button>
        <div
          ref="tooltipElement"
          :id="errorId"
          class="zt-form-item__error"
          :class="[`is-${tooltipPlacement}`, { 'is-visible': tooltipVisible }]"
          role="alert"
          :style="tooltipStyle"
        >{{ validateMessage }}</div>
      </template>
    </div>
  </div>
</template>
