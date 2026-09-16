<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, useAttrs } from 'vue'
import type { ZtButtonProps } from './types'
import './button.scss'

defineOptions({ name: 'ZtButton', inheritAttrs: false })

const props = withDefaults(defineProps<ZtButtonProps>(), {
  status: 'default',
  circle: false,
  disabled: false,
  loading: false,
  loadingText: '正在处理…',
  type: 'button',
})
const configSize = useZtSize(props)


const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'zt-button',
  `zt-button--${props.status}`,
  configSize.value !== 'default' && `zt-button--${configSize.value}`,
  {
    'zt-button--circle': props.circle,
    'zt-button--close': props.circle && String(attrs['aria-label'] ?? '').includes('关闭'),
  },
])

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="zt-button__spinner" aria-hidden="true" />
    <slot v-if="!loading" />
    <span v-else-if="!circle">{{ loadingText }}</span>
  </button>
</template>
