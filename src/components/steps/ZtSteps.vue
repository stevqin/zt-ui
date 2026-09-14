<script setup lang="ts">
import { computed, onMounted, onUpdated, provide, ref, watch } from 'vue'
import type { ZtStepStatus, ZtStepsProps } from './types'
import { ztStepsKey } from './types'
import './steps.scss'

defineOptions({ name: 'ZtSteps', inheritAttrs: false })

const props = withDefaults(defineProps<ZtStepsProps>(), {
  active: 0,
  direction: 'horizontal',
  alignCenter: false,
  simple: false,
  space: '',
  finishStatus: 'finish',
  processStatus: 'process',
  size: 'default',
})

const emit = defineEmits<{
  change: [current: number, previous: number]
}>()

const stepIds = ref<number[]>([])
const root = ref<HTMLElement | null>(null)
const stepElements = new Map<number, HTMLElement>()
const effectiveDirection = computed(() => props.simple ? 'horizontal' : props.direction)
const effectiveAlignCenter = computed(() => !props.simple && props.alignCenter)

function registerStep(id: number) {
  if (!stepIds.value.includes(id)) stepIds.value.push(id)
}

function unregisterStep(id: number) {
  stepElements.delete(id)
  const index = stepIds.value.indexOf(id)
  if (index >= 0) stepIds.value.splice(index, 1)
}

function setStepElement(id: number, element: HTMLElement | null) {
  if (element) stepElements.set(id, element)
  else stepElements.delete(id)
}

function syncStepOrder() {
  if (!root.value) return
  const idsByElement = new Map(Array.from(stepElements, ([id, element]) => [element, id]))
  const ordered = Array.from(root.value.children)
    .map(element => idsByElement.get(element as HTMLElement))
    .filter((id): id is number => id !== undefined)
  const pending = stepIds.value.filter(id => !ordered.includes(id))
  const next = [...ordered, ...pending]
  if (next.length !== stepIds.value.length || next.some((id, index) => id !== stepIds.value[index])) {
    stepIds.value = next
  }
}

onMounted(syncStepOrder)
onUpdated(syncStepOrder)

provide(ztStepsKey, {
  active: computed(() => props.active),
  direction: effectiveDirection,
  alignCenter: effectiveAlignCenter,
  simple: computed(() => props.simple),
  space: computed(() => props.space),
  finishStatus: computed(() => props.finishStatus as ZtStepStatus),
  processStatus: computed(() => props.processStatus as ZtStepStatus),
  registerStep,
  unregisterStep,
  setStepElement,
  getIndex: id => stepIds.value.indexOf(id),
})

watch(() => props.active, (current, previous) => {
  emit('change', current, previous)
})

const classes = computed(() => [
  'zt-steps',
  `zt-steps--${effectiveDirection.value}`,
  `zt-steps--${props.size}`,
  {
    'is-align-center': effectiveAlignCenter.value,
    'zt-steps--simple': props.simple,
  },
])
</script>

<template>
  <div ref="root" :class="classes" role="list" v-bind="$attrs">
    <slot />
  </div>
</template>
