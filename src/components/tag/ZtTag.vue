<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed } from 'vue'
import type { ZtTagProps } from './types'
import './tag.scss'

defineOptions({ name: 'ZtTag', inheritAttrs: false })

const props = withDefaults(defineProps<ZtTagProps>(), {
  status: 'default',
  effect: 'light',
  closable: false,
  round: false,
  hit: false,
})
const configSize = useZtSize(props)


const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

const classes = computed(() => [
  'zt-tag',
  `zt-tag--${props.status}`,
  `zt-tag--${props.effect}`,
  configSize.value !== 'default' && `zt-tag--${configSize.value}`,
  {
    'zt-tag--round': props.round,
    'zt-tag--hit': props.hit,
  },
])

function handleClose(event: MouseEvent) {
  emit('close', event)
}
</script>

<template>
  <span :class="classes" v-bind="$attrs">
    <slot />
    <span v-if="closable" class="zt-tag__close" @click="handleClose">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </span>
  </span>
</template>
