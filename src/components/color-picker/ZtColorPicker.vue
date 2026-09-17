<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { computed, inject, ref, watch } from 'vue';
import { ZtPopover } from '../popover';
import { ZtColorPickerPanel } from '../color-picker-panel';
import { useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import { parseColor, toHex } from './color';
import type { ZtColorPickerProps } from './types';
import './color-picker.scss';
defineOptions({ name: 'ZtColorPicker' });
const props = withDefaults(defineProps<ZtColorPickerProps>(), {
  status: 'primary',
  modelValue: '',
  showAlpha: false,
  presets: () => [],
  disabled: false,
  readonly: false,
  clearable: false,
});
const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
  confirm: [value: string];
  cancel: [];
  clear: [];
  'visible-change': [value: boolean];
}>();
const form = inject(ztFormItemKey, undefined),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  visible = ref(false),
  button = ref<HTMLButtonElement>(),
  color = computed(() => parseColor(props.modelValue)),
  background = computed(() =>
    color.value ? toHex(color.value, true) : 'transparent',
  );
function setVisible(value: boolean) {
  if (value && (disabled.value || props.readonly)) return;
  if (value !== visible.value) {
    visible.value = value;
    emit('visible-change', value);
  }
}
function close() {
  setVisible(false);
}
function commit(value: string) {
  if (disabled.value || props.readonly) return;
  emit('update:modelValue', value);
  emit('change', value);
  close();
  button.value?.focus();
}
watch([disabled, () => props.readonly], ([off, read]) => {
  if (off || read) close();
});
defineExpose({
  open: () => setVisible(true),
  close,
  focus: () => button.value?.focus(),
});
</script>
<template>
  <span
    class="zt-color-picker zt-entry-status"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
    :class="`zt-color-picker--${size}`"
    ><ZtPopover
      :visible="visible"
      trigger="click"
      :disabled="disabled || readonly"
      :show-arrow="false"
      placement="bottom-start"
      @update:visible="setVisible"
      ><button
        :id="form?.inputId"
        ref="button"
        type="button"
        aria-label="选择颜色"
        :disabled="disabled"
        :aria-readonly="readonly"
        :aria-expanded="visible"
        :aria-invalid="
          (!!modelValue && !color) ||
          form?.validateState.value === 'error' ||
          undefined
        "
        :aria-describedby="
          form?.validateMessage.value ? form.errorId : undefined
        "
        @blur="form?.validate('blur')"
      >
        <span :style="{ background }" /><span>{{
          modelValue || '选择颜色'
        }}</span></button
      ><template #content
        ><ZtColorPickerPanel
          v-if="visible"
          :model-value="modelValue"
          :status="status"
          :show-alpha="showAlpha"
          :presets="presets"
          :disabled="disabled"
          :readonly="readonly"
          :clearable="clearable"
          :size="size"
          @update:model-value="commit"
          @confirm="emit('confirm', $event)"
          @cancel="
            close();
            emit('cancel');
          "
          @clear="emit('clear')" /></template></ZtPopover
  ></span>
</template>
