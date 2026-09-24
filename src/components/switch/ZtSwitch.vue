<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject } from 'vue'
import { ztFormItemKey } from '../form/context'
import { useZtControlDisabled } from '../form/useControlDisabled'
import type { ZtSwitchProps } from './types'
import './switch.scss'

defineOptions({ name: 'ZtSwitch', inheritAttrs: false })

const props = withDefaults(defineProps<ZtSwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  status: 'primary',
  activeValue: true,
  inactiveValue: false,
})
const formItem = inject(ztFormItemKey, undefined)
const configSize = useZtSize(props, () => formItem?.size.value)
const isDisabled = useZtControlDisabled(() => props.disabled)


const emit = defineEmits<{
  'update:modelValue': [val: boolean | string | number]
  change: [val: boolean | string | number]
}>()

const isChecked = computed(() => props.modelValue === props.activeValue)

const classes = computed(() => [
  'zt-switch',
  `zt-switch--${props.status}`,
  isChecked.value && 'is-checked',
  isDisabled.value && 'is-disabled',
  props.loading && 'is-loading',
  configSize.value !== 'default' && `zt-switch--${configSize.value}`,
])

const trackStyle = computed(() => {
  if (props.width) return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
  return undefined
})

function toggle() {
  if (isDisabled.value || props.loading) return
  const next = isChecked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
  void formItem?.validate('change')
}
</script>

<template>
  <div :class="classes" :style="trackStyle" v-bind="$attrs" role="switch" :id="formItem?.inputId" :aria-checked="isChecked" :aria-disabled="isDisabled || loading" :aria-busy="loading" :tabindex="isDisabled || loading ? -1 : 0" @click="toggle" @keydown.space.prevent="toggle" @keydown.enter.prevent="toggle" @focusout="formItem?.validate('blur')">
    <span v-if="inactiveText" class="zt-switch__label zt-switch__label--left" :class="{ 'is-active': !isChecked }">
      {{ inactiveText }}
    </span>
    <span class="zt-switch__track">
      <span class="zt-switch__thumb" />
      <span v-if="loading" class="zt-switch__spinner" aria-hidden="true" />
    </span>
    <span v-if="activeText" class="zt-switch__label zt-switch__label--right" :class="{ 'is-active': isChecked }">
      {{ activeText }}
    </span>
  </div>
</template>
