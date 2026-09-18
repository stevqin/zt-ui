<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { toRef, inject } from 'vue';
import { ztFormItemKey } from '../form/context';
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import { computed, ref } from 'vue';
import { ZtSelect } from '../select';
import type { ZtSelectModelValue } from '../select/types';
import type { ZtTimeSelectProps } from './types';
import { generateTimeOptions } from './time';
defineOptions({ name: 'ZtTimeSelect' });
const props = withDefaults(defineProps<ZtTimeSelectProps>(), {
  underline: undefined,
  status: 'primary',
  modelValue: null,
  start: '09:00',
  end: '18:00',
  step: '00:30',
  disabledRanges: () => [],
  disabled: false,
  clearable: false,
  filterable: true,
  placeholder: '请选择时间',
});
const { underline } = useFormControlAppearance(toRef(props, 'underline'));
const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  change: [value: string | null];
  clear: [];
}>();
const form = inject(ztFormItemKey, undefined);
const options = computed(() => generateTimeOptions(props)),
  select = ref<InstanceType<typeof ZtSelect>>();
function update(value: ZtSelectModelValue) {
  const next = typeof value === 'string' ? value : null;
  emit('update:modelValue', next);
  emit('change', next);
}
defineExpose({
  focus: () => select.value?.focus(),
  blur: () => select.value?.blur(),
  open: () => select.value?.open(),
  close: () => select.value?.close(),
});
</script>
<template>
  <ZtSelect
    ref="select"
    class="zt-entry-status"
    :class="{ 'is-form-underline': underline }"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
    :model-value="modelValue"
    :options="options"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :placeholder="placeholder"
    no-data-text="无可用时间，请检查时间范围与步长"
    @update:model-value="update"
    @clear="emit('clear')"
  />
</template>
