<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject, provide, toRef } from 'vue'
import type { ZtCheckboxGroupProps, CheckboxGroupContext } from './types'
import { checkboxGroupKey } from './types'
import './checkbox.scss'
import { ztFormItemKey } from '../form/context'

defineOptions({ name: 'ZtCheckboxGroup', inheritAttrs: false })

const props = withDefaults(defineProps<ZtCheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  min: 0,
  max: Infinity,
  status: 'primary',
})
const formItem = inject(ztFormItemKey, undefined)
const configSize = useZtSize(props, () => formItem?.size.value)
const isDisabled = computed(() => props.disabled || formItem?.disabled.value || false)


const emit = defineEmits<{
  'update:modelValue': [val: unknown[]]
  change: [val: unknown[]]
}>()

function toggle(val: unknown) {
  if (isDisabled.value) return
  const arr = [...(props.modelValue ?? [])]
  const idx = arr.indexOf(val)
  if (idx === -1) {
    if (props.max !== Infinity && arr.length >= props.max) return
    arr.push(val)
  } else {
    if (props.min !== 0 && arr.length <= props.min) return
    arr.splice(idx, 1)
  }
  emit('update:modelValue', arr)
  emit('change', arr)
}

provide<CheckboxGroupContext>(checkboxGroupKey, {
  modelValue: toRef(props, 'modelValue'),
  disabled: isDisabled,
  size: computed(() => configSize.value),
  status: computed(() => props.status),
  min: computed(() => props.min),
  max: computed(() => props.max),
  toggle,
  isChecked: (val: unknown) => (props.modelValue ?? []).includes(val),
})
</script>

<template>
  <div class="zt-checkbox-group" v-bind="$attrs">
    <slot />
  </div>
</template>
