<script setup lang="ts">
import { computed, provide } from 'vue'
import { useZtSize } from '../config-provider/context'
import { descriptionsKey } from './context'
import type { ZtDescriptionsProps } from './types'
import './descriptions.scss'

defineOptions({ name: 'ZtDescriptions' })
const props = withDefaults(defineProps<ZtDescriptionsProps>(), {
  column: 3,
  border: false,
  direction: 'horizontal',
})
const size = useZtSize(props)
const column = computed(() => Number.isFinite(props.column) ? Math.max(1, Math.floor(props.column)) : 3)
const labelWidth = computed(() => props.labelWidth)
const direction = computed(() => props.direction)
provide(descriptionsKey, { labelWidth, direction, column })
</script>

<template>
  <section class="zt-descriptions" :class="[`zt-descriptions--${size}`, { 'is-bordered': border }]">
    <header v-if="title || $slots.title || $slots.extra" class="zt-descriptions__header">
      <div v-if="title || $slots.title" class="zt-descriptions__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="$slots.extra" class="zt-descriptions__extra"><slot name="extra" /></div>
    </header>
    <dl :aria-label="title" :style="{ '--zt-descriptions-columns': column }"><slot /></dl>
  </section>
</template>
