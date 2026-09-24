<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import type { CSSProperties } from 'vue'
import type { ZtStepProps, ZtStepStatus } from './types'
import { ztStepsKey } from './types'

defineOptions({ name: 'ZtStep', inheritAttrs: false })

const props = withDefaults(defineProps<ZtStepProps>(), {
  title: '',
  description: '',
})

const steps = inject(ztStepsKey, null)
const id = getCurrentInstance()!.uid
const stepElement = ref<HTMLElement | null>(null)
steps?.registerStep(id)
onMounted(() => steps?.setStepElement(id, stepElement.value))
onBeforeUnmount(() => {
  steps?.setStepElement(id, null)
  steps?.unregisterStep(id)
})

const index = computed(() => steps?.getIndex(id) ?? 0)
const status = computed<ZtStepStatus>(() => {
  if (props.status) return props.status
  if (!steps || index.value < 0) return 'wait'
  if (index.value < steps.active.value) return steps.finishStatus.value
  if (index.value === steps.active.value) return steps.processStatus.value
  return 'wait'
})

const classes = computed(() => [
  'zt-step',
  `is-${status.value}`,
])

const stepStyle = computed<CSSProperties | undefined>(() => {
  if (!steps || steps.simple.value || steps.direction.value === 'vertical' || steps.space.value === '') return undefined
  const size = typeof steps.space.value === 'number' ? `${steps.space.value}px` : steps.space.value
  return { flex: `0 0 ${size}`, maxWidth: size }
})

const showDescription = computed(() => !steps?.simple.value && (!!props.description))
const isCurrent = computed(() => index.value === steps?.active.value)
</script>

<template>
  <div
    ref="stepElement"
    :class="classes"
    :style="stepStyle"
    role="listitem"
    :aria-current="isCurrent ? 'step' : undefined"
    v-bind="$attrs"
  >
    <div class="zt-step__head">
      <div class="zt-step__icon">
        <slot name="icon">
          <component :is="icon" v-if="icon && typeof icon !== 'string'" />
          <ZtIcon v-else-if="icon" :name="icon as any" />
          <svg v-else-if="status === 'success'" class="zt-step__status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
          <svg v-else-if="status === 'error'" class="zt-step__status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          <span v-else class="zt-step__number">{{ index + 1 }}</span>
        </slot>
      </div>
      <div v-if="!steps?.simple.value" class="zt-step__line"><i /></div>
    </div>

    <div class="zt-step__main">
      <div class="zt-step__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="showDescription || (!steps?.simple.value && $slots.description)" class="zt-step__description"><slot name="description">{{ description }}</slot></div>
    </div>

    <svg v-if="steps?.simple.value" class="zt-step__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
  </div>
</template>
