<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject } from 'vue'
import type { ZtRadioProps } from './types'
import { radioGroupKey } from './types'
import './radio.scss'

defineOptions({ name: 'ZtRadio', inheritAttrs: false })

const props = withDefaults(defineProps<ZtRadioProps>(), {
  disabled: false,
  status: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [val: unknown]
  change: [val: unknown]
}>()

const group = inject(radioGroupKey, null)

const isGroup = computed(() => !!group)
const isDisabled = computed(() => group?.disabled.value ?? props.disabled)
const actualSize = useZtSize(props, () => group?.size.value)
const actualStatus = computed(() => group?.status.value ?? props.status)

const isChecked = computed(() => {
  const val = isGroup.value ? group!.modelValue.value : props.modelValue
  return val === props.label
})

const classes = computed(() => [
  'zt-radio',
  `zt-radio--${actualStatus.value}`,
  isChecked.value && 'is-checked',
  isDisabled.value && 'is-disabled',
  props.border && 'is-bordered',
  actualSize.value !== 'default' && `zt-radio--${actualSize.value}`,
])

function handleChange() {
  if (isDisabled.value) return
  const val = props.label
  if (isGroup.value) {
    group!.change(val)
  } else {
    emit('update:modelValue', val)
    emit('change', val)
  }
}
</script>

<template>
  <label :class="classes" v-bind="$attrs">
    <span class="zt-radio__input" @click.prevent="handleChange">
      <span class="zt-radio__inner" />
      <input type="radio" :checked="isChecked" :disabled="isDisabled" :name="name" tabindex="-1" />
    </span>
    <span class="zt-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
