<script setup lang="ts">
import ZtDatePickerBase from './ZtDatePickerBase.vue';
import type { ZtDatePickerPanelProps, ZtDatePickerValue } from './types';
defineOptions({ name: 'ZtDatePickerPanel' });
withDefaults(defineProps<ZtDatePickerPanelProps>(), { showHolidays: true });
const emit = defineEmits<{
  'update:modelValue': [value: ZtDatePickerValue];
  change: [value: ZtDatePickerValue];
}>();
</script>
<template>
  <ZtDatePickerBase
    v-bind="$props"
    inline
    :datetime="false"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>
