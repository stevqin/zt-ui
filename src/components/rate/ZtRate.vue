<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { computed, inject, ref } from 'vue';
import { useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import { useZtControlDisabled } from '../form/useControlDisabled';
import type { ZtRateProps } from './types';
import './rate.scss';
defineOptions({ name: 'ZtRate' });
const props = withDefaults(defineProps<ZtRateProps>(), {
  status: 'primary',
  modelValue: 0,
  max: 5,
  allowHalf: false,
  clearable: false,
  disabled: false,
  readonly: false,
  showScore: false,
  texts: () => [],
  label: '评分',
});
const emit = defineEmits<{
  'update:modelValue': [value: number];
  change: [value: number];
}>();
const form = inject(ztFormItemKey, undefined),
  size = useZtSize(props, () => form?.size.value),
  disabled = useZtControlDisabled(() => props.disabled),
  max = computed(() =>
    Number.isFinite(props.max) ? Math.max(1, Math.floor(props.max)) : 5,
  ),
  preview = ref<number | null>(null),
  score = computed(() =>
    Math.min(
      max.value,
      Math.max(0, Number.isFinite(props.modelValue) ? props.modelValue : 0),
    ),
  ),
  display = computed(() => preview.value ?? score.value),
  text = computed(
    () => props.texts[Math.ceil(display.value) - 1] ?? String(display.value),
  ),
  editable = computed(() => !disabled.value && !props.readonly);
function set(value: number, toggle = false) {
  if (!editable.value) return;
  value = Math.min(max.value, Math.max(0, value));
  if (toggle && props.clearable && value === score.value) value = 0;
  if (value === props.modelValue) return;
  emit('update:modelValue', value);
  emit('change', value);
  void form?.validate('change');
}
function point(event: MouseEvent, index: number) {
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  return props.allowHalf && event.clientX - bounds.left < bounds.width / 2
    ? index - 0.5
    : index;
}
function key(e: KeyboardEvent) {
  if (!editable.value) return;
  const step = props.allowHalf ? 0.5 : 1;
  const values: Record<string, number> = {
    ArrowRight: score.value + step,
    ArrowUp: score.value + step,
    ArrowLeft: score.value - step,
    ArrowDown: score.value - step,
    Home: 0,
    End: max.value,
  };
  if (e.key in values) {
    e.preventDefault();
    set(values[e.key]!);
  } else if (props.clearable && ['Delete', 'Backspace'].includes(e.key)) {
    e.preventDefault();
    set(0);
  }
}
</script>
<template>
  <div
    :id="form?.inputId"
    class="zt-rate zt-entry-status"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
    :class="`zt-rate--${size}`"
    role="slider"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="score"
    :aria-valuetext="text"
    :aria-disabled="disabled"
    :aria-readonly="readonly"
    :aria-invalid="form?.validateState.value === 'error' || undefined"
    :aria-describedby="form?.validateMessage.value ? form.errorId : undefined"
    @keydown="key"
    @mouseleave="preview = null"
    @blur="
      preview = null;
      form?.validate('blur');
    "
  >
    <span
      v-for="n in max"
      :key="n"
      class="zt-rate__icon"
      aria-hidden="true"
      @mousemove="editable && (preview = point($event, n))"
      @click="set(point($event, n), true)"
      ><span class="zt-rate__empty"><slot name="icon" :index="n">★</slot></span
      ><span
        class="zt-rate__filled"
        :style="{
          width: `${Math.min(1, Math.max(0, display - n + 1)) * 100}%`,
        }"
        ><slot name="icon" :index="n">★</slot></span
      ></span
    ><span v-if="showScore || texts.length" class="zt-rate__text">{{
      text
    }}</span>
  </div>
</template>
