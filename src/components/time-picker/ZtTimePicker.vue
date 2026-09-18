<script setup lang="ts">
import { entryStatusStyle } from '../autocomplete/status';
import { toRef, computed, inject, nextTick, ref, useAttrs, useId, watch } from 'vue';
import { ZtInput } from '../input';
import { ZtPopover } from '../popover';
import { useZtSize } from '../config-provider/context';
import { ztFormItemKey } from '../form/context';
import { useFormControlAppearance } from '../form/useFormControlAppearance';
import type {
  ZtTimePickerProps,
  ZtTimePickerValue,
  ZtTimePickerEndpoint,
} from './types';
import './time-picker.scss';
defineOptions({ name: 'ZtTimePicker', inheritAttrs: false });
const props = withDefaults(defineProps<ZtTimePickerProps>(), {
  underline: undefined,
  status: 'primary',
  modelValue: null,
  range: false,
  format: 'HH:mm',
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  disabled: false,
  readonly: false,
  clearable: false,
  placeholder: '请选择时间',
});
const { underline } = useFormControlAppearance(toRef(props, 'underline'));
const emit = defineEmits<{
  'update:modelValue': [value: ZtTimePickerValue];
  change: [value: ZtTimePickerValue];
  clear: [];
  'visible-change': [visible: boolean];
}>();
const form = inject(ztFormItemKey, undefined),
  size = useZtSize(props, () => form?.size.value),
  disabled = computed(() => props.disabled || form?.disabled.value),
  input = ref<InstanceType<typeof ZtInput>>(),
  panel = ref<HTMLElement>(),
  visible = ref(false),
  endpoint = ref<ZtTimePickerEndpoint>('start'),
  start = ref([0, 0, 0]),
  end = ref([23, 59, 59]),
  attrs = useAttrs(),
  id = useId();
const units = ['hour', 'minute', 'second'] as const;
function grid(unit: number) {
  const limit = unit === 0 ? 24 : 60,
    raw = [props.hourStep, props.minuteStep, props.secondStep][unit]!,
    step =
      Number.isFinite(raw) && raw >= 1 ? Math.min(limit, Math.floor(raw)) : 1;
  return Array.from({ length: Math.ceil(limit / step) }, (_, i) => i * step);
}
const columns = computed(() =>
  units
    .slice(0, props.format === 'HH:mm' ? 2 : 3)
    .map((unit, index) => ({ unit, index, values: grid(index) })),
);
function parse(value: string | undefined, fallback: number[]) {
  if (!value) return [...fallback];
  const match = value.match(
    props.format === 'HH:mm'
      ? /^(\d{2}):(\d{2})$/
      : /^(\d{2}):(\d{2}):(\d{2})$/,
  );
  if (!match) return [...fallback];
  const parts = [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
  return parts[0]! < 24 && parts[1]! < 60 && parts[2]! < 60
    ? parts
    : [...fallback];
}
function format(value: number[]) {
  return value
    .slice(0, props.format === 'HH:mm' ? 2 : 3)
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}
const current = computed(() =>
    endpoint.value === 'start' ? start.value : end.value,
  ),
  display = computed(() =>
    Array.isArray(props.modelValue)
      ? props.modelValue.join(' 至 ')
      : (props.modelValue ?? ''),
  ),
  valid = computed(
    () =>
      !props.disabledTime?.(format(start.value), 'start') &&
      (!props.range ||
        (format(start.value) <= format(end.value) &&
          !props.disabledTime?.(format(end.value), 'end'))),
  );
function reset() {
  const values = Array.isArray(props.modelValue)
    ? props.modelValue
    : [props.modelValue ?? ''];
  start.value = parse(values[0], [0, 0, 0]);
  end.value = parse(values[1], [
    grid(0)[grid(0).length - 1]!,
    grid(1)[grid(1).length - 1]!,
    grid(2)[grid(2).length - 1]!,
  ]);
  endpoint.value = 'start';
}
function setVisible(value: boolean) {
  if (value && (disabled.value || props.readonly)) return;
  if (value && !visible.value) reset();
  if (value !== visible.value) {
    visible.value = value;
    emit('visible-change', value);
  }
}
function candidate(
  index: number,
  value: number,
  base = current.value,
  side = endpoint.value,
): number[] | undefined {
  const next = [...base];
  next[index] = value;
  if (!props.disabledTime?.(format(next), side)) return next;
  if (index === 2) return;
  // A valid hour must remain reachable even when its minutes/seconds differ.
  // Prefer current lower units, then the nearest permitted grid values.
  const ordered = (unit: number) =>
    grid(unit).sort(
      (a, b) => Math.abs(a - base[unit]!) - Math.abs(b - base[unit]!),
    );
  for (const minute of index === 0 ? ordered(1) : [next[1]!])
    for (const second of props.format === 'HH:mm' ? [0] : ordered(2)) {
      const possible = [next[0]!, minute, second];
      if (!props.disabledTime?.(format(possible), side)) return possible;
    }
}
function blocked(index: number, value: number) {
  return disabled.value || props.readonly || !candidate(index, value);
}
function choose(index: number, value: number) {
  if (disabled.value || props.readonly) return;
  const next = candidate(index, value);
  if (!next) return;
  if (endpoint.value === 'start') start.value = next;
  else end.value = next;
}
function key(e: KeyboardEvent, index: number, value: number) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const values = grid(index).filter((v) => !blocked(index, v));
  if (!values.length) return;
  const at = values.indexOf(value),
    next =
      e.key === 'Home'
        ? values[0]!
        : e.key === 'End'
          ? values[values.length - 1]!
          : values[
              (at + (e.key === 'ArrowDown' ? 1 : -1) + values.length) %
                values.length
            ]!;
  choose(index, next);
  void nextTick(() =>
    panel.value
      ?.querySelector<HTMLButtonElement>(
        `[data-unit="${units[index]}"] [data-value="${next}"]`,
      )
      ?.focus(),
  );
}
function close() {
  setVisible(false);
}
function focusout(event: FocusEvent) {
  const target = event.relatedTarget;
  if (
    target instanceof Node &&
    (panel.value?.contains(target) || input.value?.input === target)
  )
    return;
  close();
}
watch(visible, async (v) => {
  if (v) {
    await nextTick();
    panel.value
      ?.querySelectorAll<HTMLElement>('[aria-selected=true]')
      .forEach((el) => el.scrollIntoView?.({ block: 'nearest' }));
  }
});
function commit(value: ZtTimePickerValue) {
  if (disabled.value || props.readonly) return;
  emit('update:modelValue', value);
  emit('change', value);
  void nextTick(() => form?.validate('change'));
  close();
  input.value?.focus();
}
function confirm() {
  if (valid.value)
    commit(
      props.range
        ? [format(start.value), format(end.value)]
        : format(start.value),
    );
}
function clear() {
  if (!display.value || disabled.value || props.readonly) return;
  commit(null);
  emit('clear');
}
function inputKey(e: KeyboardEvent) {
  if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
    setVisible(true);
    void nextTick(() =>
      panel.value
        ?.querySelector<HTMLButtonElement>('[role=option][tabindex="0"]')
        ?.focus(),
    );
  }
}
watch([disabled, () => props.readonly], ([off, read]) => {
  if (off || read) close();
});
watch(
  () => props.modelValue,
  () => {
    if (visible.value) reset();
  },
  { deep: true },
);
defineExpose({
  focus: () => input.value?.focus(),
  blur: () => {
    input.value?.blur();
    close();
  },
  open: () => setVisible(true),
  close,
  clear,
});
</script>
<template>
  <div
    class="zt-time-picker zt-entry-status"
    :class="{ 'is-form-underline': underline, 'is-disabled': disabled, 'is-open': visible }"
    :style="
      entryStatusStyle(
        form?.validateState.value === 'error' ? 'danger' : status,
      )
    "
  >
    <ZtPopover
      :visible="visible"
      trigger="click"
      :disabled="disabled || readonly"
      :restore-focus="false"
      :show-arrow="false"
      placement="bottom-start"
      width="min(320px, calc(100vw - 24px))"
      @update:visible="setVisible"
      ><ZtInput
        ref="input"
        v-bind="attrs"
        :model-value="display"
        :size="size"
        :disabled="disabled"
        readonly
        :placeholder="placeholder"
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="visible"
        :aria-controls="id"
        @keydown="inputKey"
        @blur="focusout"
        ><template #suffix
          ><span v-if="clearable" class="zt-time-picker__clear-slot"><button
            v-if="clearable && display && !disabled && !readonly"
            type="button"
            class="zt-time-picker__clear"
            aria-label="清空时间"
            @mousedown.prevent
            @click.stop="clear"
          >
            ×</button></span
          ><span aria-hidden="true">◷</span></template
        ></ZtInput
      ><template #content
        ><div
          :id="id"
          ref="panel"
          class="zt-time-picker__panel zt-entry-status"
          :style="
            entryStatusStyle(
              form?.validateState.value === 'error' ? 'danger' : status,
            )
          "
          :class="`zt-time-picker--${size}`"
          @keydown.esc.stop.prevent="
            close();
            input?.focus();
          "
          @focusout="focusout"
        >
          <div
            v-if="range"
            class="zt-time-picker__endpoints"
            role="group"
            aria-label="选择时间端点"
          >
            <button
              type="button"
              :aria-pressed="endpoint === 'start'"
              @click="endpoint = 'start'"
            >
              开始 {{ format(start) }}</button
            ><button
              type="button"
              :aria-pressed="endpoint === 'end'"
              @click="endpoint = 'end'"
            >
              结束 {{ format(end) }}
            </button>
          </div>
          <p v-if="range" aria-live="polite">
            正在选择{{ endpoint === 'start' ? '开始' : '结束' }}时间
          </p>
          <div class="zt-time-picker__columns">
            <div
              v-for="column in columns"
              :key="column.unit"
              :data-unit="column.unit"
              class="zt-time-picker__column"
              role="listbox"
              :aria-label="['小时', '分钟', '秒'][column.index]"
            >
              <button
                v-for="value in column.values"
                :key="value"
                type="button"
                role="option"
                :data-value="value"
                :aria-selected="current[column.index] === value"
                :tabindex="
                  (current[column.index] === value &&
                    !blocked(column.index, value)) ||
                  (!column.values.some(
                    (v) =>
                      v === current[column.index] && !blocked(column.index, v),
                  ) &&
                    value ===
                      column.values.find((v) => !blocked(column.index, v)))
                    ? 0
                    : -1
                "
                :disabled="blocked(column.index, value)"
                @click="choose(column.index, value)"
                @keydown="key($event, column.index, value)"
              >
                {{ String(value).padStart(2, '0') }}
              </button>
            </div>
          </div>
          <p v-if="!valid" role="alert">时间被禁用或结束时间早于开始时间</p>
          <footer>
            <button
              type="button"
              @click="
                close();
                input?.focus();
              "
            >
              取消</button
            ><button
              type="button"
              data-action="confirm"
              :disabled="!valid || disabled || readonly"
              @click="confirm"
            >
              确定
            </button>
          </footer>
        </div></template
      ></ZtPopover
    >
  </div>
</template>
