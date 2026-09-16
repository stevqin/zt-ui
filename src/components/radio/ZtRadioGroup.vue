<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, provide, toRef } from 'vue'
import type { ZtRadioGroupProps, RadioGroupContext } from './types'
import { radioGroupKey } from './types'
import './radio.scss'

defineOptions({ name: 'ZtRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<ZtRadioGroupProps>(), {
  disabled: false,
  status: 'primary',
})
const configSize = useZtSize(props)


const emit = defineEmits<{
  'update:modelValue': [val: unknown]
  change: [val: unknown]
}>()

provide<RadioGroupContext>(radioGroupKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: computed(() => props.disabled),
  size: computed(() => configSize.value),
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
