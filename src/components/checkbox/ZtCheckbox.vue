<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, inject, onMounted, ref, watch } from 'vue'
import type { ZtCheckboxProps } from './types'
import { checkboxGroupKey } from './types'
import './checkbox.scss'

defineOptions({ name: 'ZtCheckbox', inheritAttrs: false })

const props = withDefaults(defineProps<ZtCheckboxProps>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
  status: 'primary',
  border: false,
  checked: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  change: [val: boolean]
}>()

const group = inject(checkboxGroupKey, null)
const isGroup = computed(() => !!group)
const selfVal = ref(props.modelValue)

watch(() => props.modelValue, value => {
  if (!isGroup.value) selfVal.value = value
})

onMounted(() => {
  // In group mode with value, auto-register checked state on mount
  if (isGroup.value && props.value !== undefined && props.checked) {
    if (!group!.isChecked(props.value)) {
      group!.toggle(props.value)
    }
  }
})

const isChecked = computed(() => {
  if (isGroup.value) {
    return group!.isChecked(props.value)
  }
  return selfVal.value
})

const isDisabled = computed(() => {
  if (isGroup.value) return group!.disabled.value || props.disabled
  return props.disabled
})

const actualSize = useZtSize(props, () => group?.size.value)
const actualStatus = computed(() => group?.status.value ?? props.status)

const classes = computed(() => [
  'zt-checkbox',
  `zt-checkbox--${actualStatus.value}`,
  isChecked.value && 'is-checked',
  isDisabled.value && 'is-disabled',
  props.indeterminate && 'is-indeterminate',
  props.border && 'is-bordered',
  actualSize.value !== 'default' && `zt-checkbox--${actualSize.value}`,
])

function handleChange() {
  if (isDisabled.value) return
  if (isGroup.value) {
    group!.toggle(props.value)
  } else {
    const next = !selfVal.value
    selfVal.value = next
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>

<template>
  <label :class="classes" v-bind="$attrs">
    <span class="zt-checkbox__input" @click.prevent="handleChange">
      <span class="zt-checkbox__inner" />
      <input type="checkbox" :aria-hidden="$attrs.role === 'checkbox' ? true : undefined" :checked="isChecked" :disabled="isDisabled" :name="name" tabindex="-1" />
    </span>
    <span v-if="$slots.default || label" class="zt-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
