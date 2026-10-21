<script setup lang="ts">
import { computed, provide } from 'vue';
import ZtCheckbox from '../checkbox/ZtCheckbox.vue';
import ZtRadio from '../radio/ZtRadio.vue';
import { checkboxGroupKey } from '../checkbox/types';
import { radioGroupKey } from '../radio/types';
import type { ZtComponentSize } from '../types';

const props = defineProps<{
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  radio?: boolean;
  name?: string;
  label: string;
  size: ZtComponentSize;
}>();
const emit = defineEmits<{ change: [] }>();
// Each control gets a controlled context, isolated from any surrounding form group.
const disabled = computed(() => !!props.disabled);
const size = computed(() => props.size);
const status = computed(() => 'primary' as const);
const change = () => {
  if (!props.disabled) emit('change');
};
provide(checkboxGroupKey, {
  modelValue: computed(() => (props.checked ? [true] : [])),
  disabled,
  size,
  status,
  min: computed(() => 0),
  max: computed(() => Infinity),
  segmented: computed(() => false),
  isChecked: () => props.checked,
  toggle: change,
});
provide(radioGroupKey, {
  modelValue: computed(() => props.checked),
  name: computed(() => props.name ?? ''),
  disabled,
  size,
  status,
  change,
});
</script>
<template>
  <span class="zt-table__selection-control" @click.stop>
    <ZtRadio v-if="radio" :label="true">
      <span class="zt-table__selection-label">{{ label }}</span>
    </ZtRadio>
    <ZtCheckbox v-else :value="true" :indeterminate="indeterminate">
      <span class="zt-table__selection-label">{{ label }}</span>
    </ZtCheckbox>
  </span>
</template>
