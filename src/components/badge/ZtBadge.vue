<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, useSlots } from 'vue'
import type { ZtBadgeProps } from './types'
import './badge.scss'

defineOptions({ name: 'ZtBadge', inheritAttrs: false })

const props = withDefaults(defineProps<ZtBadgeProps>(), {
  max: 99,
  isDot: false,
  circle: true,
  hidden: false,
  status: 'danger',
  showZero: false,
})
const configSize = useZtSize(props)


const slots = useSlots()

const content = computed(() => {
  if (props.isDot) return ''
  if (typeof props.value === 'string') return props.value
  if (typeof props.value === 'number') {
    return props.value > props.max ? `${props.max}+` : String(props.value)
  }
  return ''
})

const badgeClasses = computed(() => [
  'zt-badge__content',
  `zt-badge--${props.status}`,
  `zt-badge--${configSize.value}`,
  {
    'is-dot': props.isDot,
    'is-circle': props.circle,
    'is-fixed': !!slots.default,
  },
])

const badgeStyle = computed(() => {
  if (props.offset && slots.default) {
    return {
      transform: `translate(${props.offset[0]}px, ${props.offset[1]}px)`,
    }
  }
  return undefined
})

const isHidden = computed(() => {
  if (props.hidden) return true
  if (props.isDot) return false
  if (content.value === '' && !slots.default) return true
  if (content.value === '0' && !props.showZero) return true
  return false
})
</script>

<template>
  <div class="zt-badge" v-bind="$attrs">
    <span v-if="!isHidden" :class="badgeClasses" :style="badgeStyle">
      {{ isDot ? '' : content }}
    </span>
    <slot />
  </div>
</template>
