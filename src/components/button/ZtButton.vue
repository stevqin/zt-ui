<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, useAttrs, type CSSProperties } from 'vue'
import type { ZtButtonProps } from './types'
import './button.scss'

defineOptions({ name: 'ZtButton', inheritAttrs: false })

const props = withDefaults(defineProps<ZtButtonProps>(), {
  status: 'default',
  plain: false,
  dashed: false,
  text: false,
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
const variant = computed(() => props.text ? 'text' : props.dashed ? 'dashed' : props.plain ? 'plain' : '')
const buttonStyle = computed<CSSProperties | undefined>(() => props.color ? ({
  '--zt-button-color': props.color,
  '--zt-button-color-hover': `color-mix(in srgb, ${props.color} 84%, black)`,
  '--zt-button-color-active': `color-mix(in srgb, ${props.color} 72%, black)`,
  '--zt-button-color-soft': `color-mix(in srgb, ${props.color} 14%, transparent)`,
} as CSSProperties) : undefined)

const classes = computed(() => [
  'zt-button',
  `zt-button--${props.status}`,
  variant.value && `zt-button--${variant.value}`,
  configSize.value !== 'default' && `zt-button--${configSize.value}`,
  {
    'zt-button--circle': props.circle,
    'zt-button--close': props.circle && String(attrs['aria-label'] ?? '').includes('关闭'),
    'has-custom-color': Boolean(props.color),
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
    :style="buttonStyle"
    :disabled="isDisabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="zt-button__spinner" aria-hidden="true" />
    <slot v-if="!loading" />
    <span v-else-if="!circle">{{ loadingText }}</span>
  </button>
</template>
