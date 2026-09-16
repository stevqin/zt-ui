<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed } from 'vue'
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
const configSize = useZtSize(props)


const emit = defineEmits<{
  'update:modelValue': [val: boolean | string | number]
  change: [val: boolean | string | number]
}>()

const isChecked = computed(() => props.modelValue === props.activeValue)

const classes = computed(() => [
  'zt-switch',
  `zt-switch--${props.status}`,
  isChecked.value && 'is-checked',
  props.disabled && 'is-disabled',
  props.loading && 'is-loading',
  configSize.value !== 'default' && `zt-switch--${configSize.value}`,
])

const trackStyle = computed(() => {
  if (props.width) return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
  return undefined
})

function toggle() {
  if (props.disabled || props.loading) return
  const next = isChecked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="classes" :style="trackStyle" role="switch" :aria-checked="isChecked" v-bind="$attrs" @click="toggle">
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
