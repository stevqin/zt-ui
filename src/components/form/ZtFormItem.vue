<script setup lang="ts">
import { useZtConfig, useZtSize } from '../config-provider/context'
import { Teleport, computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
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

const config = useZtConfig()
const form = inject(ztFormKey, undefined)
const instance = getCurrentInstance()
const element = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()
const labelContent = ref<HTMLElement>()
let labelObserver: ResizeObserver | undefined
let feedbackObserver: ResizeObserver | undefined
let alive = true
const labelId = instance?.uid ?? Math.random()
const indicatorElement = ref<HTMLElement>()
const tooltipElement = ref<HTMLElement>()
const validateState = ref<ZtFormFieldContext['validateState']['value']>('')
const validateMessage = ref('')
const fieldFocused = ref(false)
const compactFeedback = ref(false)
const indicatorHovered = ref(false)
const fieldHovered = ref(false)
const popoverDismissed = ref(false)
const autoTooltipVisible = ref(false)
const tooltipPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const tooltipStyle = ref<CSSProperties>({ position: 'fixed', pointerEvents: 'none' })
const fieldKey = computed(() => props.prop == null ? '' : pathKey(props.prop))
const inputId = `zt-form-input-${instance?.uid ?? Math.random().toString(36).slice(2)}`
const errorId = `${inputId}-error`
const initialValue = cloneFormValue(props.prop != null && form ? getPathValue(form.model.value, props.prop) : undefined)
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
const messageDisplay = computed(() => props.messageDisplay ?? form?.messageDisplay?.value ?? 'tooltip')
const labelFeedback = computed(() => messageDisplay.value === 'label' && labelPosition.value === 'top' && Boolean(props.label || instance?.slots.label))
const sideLabelFeedback = computed(() => messageDisplay.value === 'label' && labelPosition.value !== 'top' && Boolean(props.label || instance?.slots.label))
const isPopover = computed(() => messageDisplay.value === 'popover' || messageDisplay.value === 'summary')
const labelPosition = computed(() => props.labelPosition ?? form?.labelPosition.value ?? 'right')
const labelWidth = computed(() => props.labelWidth ?? form?.labelWidth.value ?? 'auto')
const labelStyle = computed<CSSProperties>(() => {
  const position = labelPosition.value
  return {
    width: position === 'top' ? undefined : labelWidth.value === 'auto' ? (form?.autoLabelWidth.value ? `${form.autoLabelWidth.value}px` : undefined) : /^\d+(\.\d+)?$/.test(String(labelWidth.value)) ? `${labelWidth.value}px` : labelWidth.value,
    margin: position === 'top' ? '0 0 7px' : '0 var(--zt-form-label-gap, 12px) 0 0',
    textAlign: position === 'right' ? 'right' : 'left',
    justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
  }
})
const classes = computed(() => [
  'zt-form-item',
  `is-message-${messageDisplay.value}`,
  { 'is-label-top': labelPosition.value === 'top', 'has-side-label-feedback': sideLabelFeedback.value && showMessage.value, 'is-feedback-stacked': sideLabelFeedback.value && compactFeedback.value },
  validateState.value && `is-${validateState.value}`,
  isRequired.value && 'is-required',
  size.value !== 'default' && `zt-form-item--${size.value}`,
])
const tooltipVisible = computed(() => Boolean(
  validateMessage.value
  && showMessage.value
  && !['inline', 'label'].includes(messageDisplay.value)
  && (isPopover.value ? !popoverDismissed.value && (fieldFocused.value || fieldHovered.value) : autoTooltipVisible.value || fieldFocused.value || indicatorHovered.value),
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
  const content = contentElement.value
  const controls = content ? Array.from(content.children).filter(child => !child.matches('.zt-form-item__feedback-inline, .zt-form-item__feedback-label, .zt-form-item__error-indicator')) : []
  const anchorElement = isPopover.value ? controls.length === 1 ? controls[0] : content : indicatorElement.value
  const anchor = anchorElement?.getBoundingClientRect()
  const tooltip = tooltipElement.value?.getBoundingClientRect()
  if (!anchor || !tooltip) return

  let layer = 2000
  for (let parent = element.value; parent; parent = parent.parentElement ?? undefined) {
    const z = Number.parseFloat(getComputedStyle(parent).zIndex)
    if (Number.isFinite(z)) layer = Math.max(layer, z)
  }
  const fieldStyle = element.value ? getComputedStyle(element.value) : undefined
  const viewportPadding = 12
  const gap = 9
  const width = tooltip.width
  const height = tooltip.height
  let placement: 'left' | 'right' | 'top' | 'bottom' = 'right'
  let left = anchor.right + gap

  if (left + width > window.innerWidth - viewportPadding) {
    placement = 'left'
    left = anchor.left - gap - width
  }

  left = Math.min(Math.max(left, viewportPadding), Math.max(viewportPadding, window.innerWidth - width - viewportPadding))
  let top = Math.min(
    Math.max(anchor.top + (anchor.height - height) / 2, viewportPadding),
    Math.max(viewportPadding, window.innerHeight - height - viewportPadding),
  )

  if (isPopover.value) {
    const label = labelContent.value?.getBoundingClientRect()
    const sharesLabelRow = labelPosition.value === 'top' && label && width + label.width + 14 <= anchor.width && height <= label.height + 16
    placement = sharesLabelRow ? 'top' : 'bottom'
    left = Math.min(Math.max(sharesLabelRow ? anchor.right - width : anchor.left, viewportPadding), Math.max(viewportPadding, window.innerWidth - width - viewportPadding))
    top = sharesLabelRow ? anchor.top - height - 6 : anchor.bottom + 7
    if (placement === 'bottom' && top + height > window.innerHeight - viewportPadding) { placement = 'top'; top = anchor.top - height - 7 }
    top = Math.min(Math.max(top, viewportPadding), Math.max(viewportPadding, window.innerHeight - height - viewportPadding))
  }

  tooltipPlacement.value = placement
  tooltipStyle.value = {
    ...config.style.value,
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: layer + 1,
    fontSize: isPopover.value ? `${Math.max(11, Number.parseFloat(fieldStyle?.fontSize || '14') * .86)}px` : fieldStyle?.fontSize,
    fontFamily: fieldStyle?.fontFamily,
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
}

function handleFocusIn() {
  fieldFocused.value = true
  popoverDismissed.value = false
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
  const message = await validateValue(getPathValue(form.model.value, props.prop), activeRules, {
    trigger,
    model: form.model.value,
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
  if (form && props.prop) setPathValue(form.model.value, props.prop, cloneFormValue(initialValue))
  clearValidate()
}

const fieldContext: ZtFormFieldContext = {
  get prop() { return fieldKey.value },
  label: computed(() => props.label),
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
function measureLabel() {
  compactFeedback.value = (contentElement.value?.clientWidth ?? 0) < 360
  if (labelWidth.value === 'auto' && labelPosition.value !== 'top' && labelContent.value) {
    form?.setLabelWidth(labelId, Math.ceil(labelContent.value.getBoundingClientRect().width))
  } else form?.removeLabelWidth(labelId)
}
watch([labelWidth, labelPosition, messageDisplay, () => props.label], () => { void nextTick(measureLabel) })
onMounted(() => {
  measureLabel()
  if (typeof ResizeObserver !== 'undefined' && labelContent.value) {
    labelObserver = new ResizeObserver(measureLabel)
    labelObserver.observe(labelContent.value)
    if (contentElement.value) labelObserver.observe(contentElement.value)
  }
  if (fieldKey.value) form?.addField(fieldContext)
  window.addEventListener('resize', updateTooltipPosition)
  window.addEventListener('scroll', updateTooltipPosition, true)
})
onBeforeUnmount(() => {
  alive = false
  feedbackObserver?.disconnect()
  labelObserver?.disconnect()
  form?.removeLabelWidth(labelId)
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
  if (value && showMessage.value && !isPopover.value && !['inline', 'label'].includes(messageDisplay.value)) brieflyShowTooltip()
  else {
    clearAutoHideTimer()
    autoTooltipVisible.value = false
  }
}, { immediate: true })

watch(messageDisplay, () => { clearAutoHideTimer(); autoTooltipVisible.value = false; popoverDismissed.value = false; void nextTick(updateTooltipPosition) })

watch([tooltipVisible, messageDisplay], async ([visible]) => {
  feedbackObserver?.disconnect()
  if (!visible) return
  await nextTick()
  if (!alive || !tooltipVisible.value) return
  updateTooltipPosition()
  if (isPopover.value && typeof ResizeObserver !== 'undefined') {
    feedbackObserver = new ResizeObserver(updateTooltipPosition)
    const formElement = element.value?.closest('form')
    if (formElement) feedbackObserver.observe(formElement)
    if (contentElement.value) feedbackObserver.observe(contentElement.value)
    if (tooltipElement.value) feedbackObserver.observe(tooltipElement.value)
  }
})

defineExpose({ validate, resetField, clearValidate, validateState, validateMessage })
</script>

<template>
  <div ref="element" :class="classes" :style="{display: labelPosition === 'top' ? 'block' : 'flex'}">
    <div v-if="labelFeedback" class="zt-form-item__heading">
      <label class="zt-form-item__label" :for="inputId">
        <span ref="labelContent" class="zt-form-item__label-text"><span v-if="isRequired && !form?.hideRequiredAsterisk.value" class="zt-form-item__required" aria-hidden="true">*</span><slot name="label" :label="label">{{ label }}</slot></span>
      </label>
      <span v-if="validateMessage && showMessage" :id="errorId" class="zt-form-item__feedback-label" role="alert"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M8 4.5v4M8 11.5h.01" /></svg><span>{{ validateMessage }}</span></span>
    </div>
    <label v-else-if="label || $slots.label" class="zt-form-item__label" :for="inputId" :style="labelStyle">
      <span ref="labelContent" class="zt-form-item__label-text">
      <span v-if="isRequired && !form?.hideRequiredAsterisk.value" class="zt-form-item__required" aria-hidden="true">*</span>
      <slot name="label" :label="label">{{ label }}</slot>
      </span>
    </label>
    <div ref="contentElement" class="zt-form-item__content" @focusin="handleFocusIn" @focusout="handleFocusOut" @mouseenter="fieldHovered = true; popoverDismissed = false" @mouseleave="fieldHovered = false" @keydown.esc="isPopover && (popoverDismissed = true)">
      <slot />
      <div v-if="validateMessage && showMessage && messageDisplay === 'inline'" :id="errorId" class="zt-form-item__feedback-inline" role="alert">{{ validateMessage }}</div>
      <div v-else-if="sideLabelFeedback && showMessage" :id="validateMessage ? errorId : undefined" class="zt-form-item__feedback-label is-side" :role="validateMessage ? 'alert' : undefined" :aria-hidden="validateMessage ? undefined : true"><template v-if="validateMessage"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M8 4.5v4M8 11.5h.01" /></svg><span>{{ validateMessage }}</span></template></div>
      <div v-else-if="validateMessage && showMessage && messageDisplay === 'label' && !labelFeedback" :id="errorId" class="zt-form-item__feedback-label is-below" role="alert"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M8 4.5v4M8 11.5h.01" /></svg><span>{{ validateMessage }}</span></div>
      <template v-else-if="validateMessage && showMessage && messageDisplay !== 'label'">
        <button
          v-if="!isPopover"
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
        <Teleport to="body">
        <div
          ref="tooltipElement"
          :id="errorId"
          class="zt-form-item__error"
          :class="[`is-${tooltipPlacement}`, { 'is-visible': tooltipVisible, 'is-popover': isPopover }]"
          :role="isPopover ? 'tooltip' : 'alert'"
          :style="tooltipStyle"
        >{{ validateMessage }}</div>
        </Teleport>
      </template>
    </div>
  </div>
</template>
