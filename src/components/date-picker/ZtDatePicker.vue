<script setup lang="ts">
import { ref } from 'vue'
import { useFormControlAppearance } from '../form/useFormControlAppearance'
import ZtDatePickerBase from './ZtDatePickerBase.vue'
import type { ZtDatePickerProps, ZtDatePickerInstance, ZtDatePickerValue } from './types'
defineOptions({ name: 'ZtDatePicker', inheritAttrs: false })
withDefaults(defineProps<ZtDatePickerProps>(), { showHolidays: true })
const emit = defineEmits<{
  'update:modelValue': [value: ZtDatePickerValue]
  change: [value: ZtDatePickerValue]
  clear: []
  'visible-change': [visible: boolean]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const { underline } = useFormControlAppearance()
const picker = ref<ZtDatePickerInstance>()
defineExpose({
  focus: (options?: FocusOptions) => picker.value?.focus(options),
  blur: () => picker.value?.blur(),
  open: () => picker.value?.open(),
  close: () => picker.value?.close(),
  clear: () => picker.value?.clear(),
})
</script>
<template>
  <ZtDatePickerBase ref="picker" :class="{ 'is-form-underline': underline }" v-bind="{ ...$props, ...$attrs }" :datetime="false"
    @update:model-value="emit('update:modelValue', $event)" @change="emit('change', $event)"
    @clear="emit('clear')" @visible-change="emit('visible-change', $event)"
    @focus="emit('focus', $event)" @blur="emit('blur', $event)" />
</template>
