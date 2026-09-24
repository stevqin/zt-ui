<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import { parseColor, toHex, rgbToHsv, hsvToRgb } from '../color-picker/color';
import type { ZtColorPickerPanelProps } from './types';
import './color-picker-panel.scss';
defineOptions({ name: 'ZtColorPickerPanel' });
const props = withDefaults(defineProps<ZtColorPickerPanelProps>(), {
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
}>();
const form = inject(ztFormItemKey, undefined),
  size = useZtSize(props, () => form?.size.value),
  config = useZtConfig(),
  disabled = computed(
    () => props.disabled || form?.disabled.value || props.readonly,
  ),
  hue = ref(0),
  saturation = ref(1),
  value = ref(1),
  alpha = ref(1),
  text = ref(''),
  error = ref(''),
  palette = ref<HTMLElement>();
const color = computed(() =>
    hsvToRgb(
      hue.value,
      saturation.value,
      value.value,
      props.showAlpha ? alpha.value : 1,
    ),
  ),
  hex = computed(() => toHex(color.value, props.showAlpha)),
  hueColor = computed(() => toHex(hsvToRgb(hue.value, 1, 1)));
function load(input: string) {
  const parsed = parseColor(input);
  if (!parsed) {
    error.value = '请输入有效的 HEX、RGB 或 HSL 颜色';
    return false;
  }
  const hsv = rgbToHsv(parsed);
  hue.value = hsv.h;
  saturation.value = hsv.s;
  value.value = hsv.v;
  alpha.value = parsed.a;
  error.value = '';
  return true;
}
function reset() {
  // Keep an empty model as empty draft instead of forcing red.
  text.value = props.modelValue || '';
  if (text.value) load(text.value);
  else {
    error.value = '';
  }
}
function sync() {
  if (disabled.value) return;
  error.value = '';
  text.value = hex.value;
}
function textInput(e: Event) {
  if (disabled.value) return;
  text.value = (e.target as HTMLInputElement).value;
  load(text.value);
}
function preset(raw: string) {
  if (!disabled.value && load(raw)) text.value = hex.value;
}
function drag(e: PointerEvent) {
  if (disabled.value || !palette.value) return;
  const bounds = palette.value.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  saturation.value = Math.max(
    0,
    Math.min(1, (e.clientX - bounds.left) / bounds.width),
  );
  value.value = Math.max(
    0,
    Math.min(1, 1 - (e.clientY - bounds.top) / bounds.height),
  );
  sync();
}
let pointer: number | undefined;
function down(e: PointerEvent) {
  if (disabled.value) return;
  pointer = e.pointerId;
  palette.value?.setPointerCapture?.(e.pointerId);
  drag(e);
}
function move(e: PointerEvent) {
  if (pointer === e.pointerId) drag(e);
}
function up() {
  if (pointer !== undefined && palette.value?.hasPointerCapture?.(pointer))
    palette.value.releasePointerCapture(pointer);
  pointer = undefined;
}
function key(e: KeyboardEvent) {
  if (disabled.value) return;
  const step = e.shiftKey ? 0.1 : 0.01;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key))
    return;
  e.preventDefault();
  if (e.key === 'ArrowLeft')
    saturation.value = Math.max(0, saturation.value - step);
  if (e.key === 'ArrowRight')
    saturation.value = Math.min(1, saturation.value + step);
  if (e.key === 'ArrowUp') value.value = Math.min(1, value.value + step);
  if (e.key === 'ArrowDown') value.value = Math.max(0, value.value - step);
  sync();
}
function commit(next: string) {
  if (disabled.value) return;
  emit('update:modelValue', next);
  emit('change', next);
  void nextTick(() => form?.validate('change'));
}
function confirm() {
  if (disabled.value || error.value) return;
  commit(hex.value);
  emit('confirm', hex.value);
}
function cancel() {
  reset();
  emit('cancel');
}
function clear() {
  if (disabled.value) return;
  commit('');
  emit('clear');
}
watch(() => props.modelValue, reset, { immediate: true });
watch(() => props.showAlpha, sync);
onBeforeUnmount(up);
defineExpose({ confirm, cancel });
</script>
<template>
  <section
    class="zt-color-panel zt-entry-status"
    :class="`zt-color-panel--${size}`"
    :style="[
      config.style.value,
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      ),
    ]"
    aria-label="颜色面板"
    :aria-disabled="disabled"
    @focusout="form?.validate('blur')"
  >
    <div
      ref="palette"
      class="zt-color-panel__palette"
      :style="{ backgroundColor: hueColor }"
      role="group"
      aria-label="饱和度和明度；方向键调整，Shift 加速"
      :tabindex="disabled ? -1 : 0"
      @pointerdown.prevent="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="up"
      @lostpointercapture="pointer = undefined"
      @keydown="key"
    >
      <span
        :style="{ left: `${saturation * 100}%`, top: `${(1 - value) * 100}%` }"
      /><span class="zt-color-panel__sr" aria-live="polite"
        >饱和度 {{ Math.round(saturation * 100) }}%，明度
        {{ Math.round(value * 100) }}%</span
      >
    </div>
    <label
      >色相
      <input
        v-model.number="hue"
        type="range"
        min="0"
        max="359"
        :disabled="disabled"
        aria-label="色相"
        @input="sync" /></label
    ><label v-if="showAlpha"
      >透明度
      <input
        v-model.number="alpha"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :disabled="disabled"
        aria-label="透明度"
        @input="sync"
    /></label>
    <div class="zt-color-panel__preview">
      <span :style="{ background: hex }" aria-hidden="true" /><input
        type="text"
        :value="text"
        :disabled="disabled"
        aria-label="HEX RGB HSL 颜色"
        :aria-invalid="!!error"
        @input="textInput"
        @keydown.enter.prevent="confirm"
      />
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <div v-if="presets.length" class="zt-color-panel__presets">
      <button
        v-for="(presetColor, i) in presets"
        :key="i"
        type="button"
        :style="{
          background: parseColor(presetColor) ? presetColor : 'transparent',
        }"
        :disabled="disabled || !parseColor(presetColor)"
        :aria-label="`预设 ${presetColor}`"
        @click="preset(presetColor)"
      />
    </div>
    <footer>
      <button
        v-if="clearable"
        type="button"
        :disabled="disabled"
        @click="clear"
      >
        清空</button
      ><button type="button" data-action="cancel" @click="cancel">取消</button
      ><button
        type="button"
        data-action="confirm"
        :disabled="disabled || !!error"
        @click="confirm"
      >
        确定
      </button>
    </footer>
  </section>
</template>
