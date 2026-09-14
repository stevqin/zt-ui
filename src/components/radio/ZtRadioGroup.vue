<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import type { ZtRadioGroupProps, RadioGroupContext } from './types'
import { radioGroupKey } from './types'
import './radio.scss'

defineOptions({ name: 'ZtRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<ZtRadioGroupProps>(), {
  disabled: false,
  size: 'default',
  status: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [val: unknown]
  change: [val: unknown]
}>()

provide<RadioGroupContext>(radioGroupKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
  status: computed(() => props.status),
  change(val) {
    emit('update:modelValue', val)
    emit('change', val)
  },
})
</script>

<template>
  <div class="zt-radio-group" v-bind="$attrs">
    <slot />
  </div>
</template>
