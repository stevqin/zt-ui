<script setup lang="ts">
import { useZtSize } from '../config-provider/context'
import { computed, provide, toRef, inject, useId } from 'vue'
import type { ZtRadioGroupProps, RadioGroupContext } from './types'
import { radioGroupKey } from './types'
import { ztFormItemKey } from '../form/context'
import { useZtControlDisabled } from '../form/useControlDisabled'
import './radio.scss'

defineOptions({ name: 'ZtRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<ZtRadioGroupProps>(), {
  disabled: false,
  status: 'primary',
  segmented: false,
})
const formItem = inject(ztFormItemKey, undefined)
const configSize = useZtSize(props, () => formItem?.size.value)
const groupId = useId()


const emit = defineEmits<{
  'update:modelValue': [val: unknown]
  change: [val: unknown]
}>()

provide<RadioGroupContext>(radioGroupKey, {
  name: computed(() => props.name ?? `zt-radio-${groupId}`),
  modelValue: toRef(props, 'modelValue'),
  disabled: useZtControlDisabled(() => props.disabled),
  size: computed(() => configSize.value),
  status: computed(() => props.status),
  change(val) {
    emit('update:modelValue', val)
    emit('change', val)
    void formItem?.validate('change')
  },
})
</script>

<template>
  <div class="zt-radio-group" :class="[`zt-radio-group--${segmented ? 'segmented' : 'default'}`, `zt-radio-group--${configSize}`]" role="radiogroup" v-bind="$attrs">
    <slot />
  </div>
</template>
