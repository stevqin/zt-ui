<script setup lang="ts">
import { useZtConfig } from '../config-provider/context';
const { style: providerStyle } = useZtConfig();
import { useZtSize } from '../config-provider/context';
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
} from 'vue';
import { ztFormItemKey } from '../form/context';
import { overlayContextKey } from '../overlay/context';
import {
  addDays,
  calendarDate,
  dateKey,
  monthDays,
  normalizeTime,
  parseDate,
} from './date';
import type { ZtDatePickerProps, ZtDatePickerValue } from './types';
import ZtCalendarNavigation from './ZtCalendarNavigation.vue';
import './date-picker.scss';

defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<ZtDatePickerProps & { datetime?: boolean; inline?: boolean }>(),
  {
    modelValue: null,
    range: false,
    datetime: false,
    inline: false,
    disabled: false,
    readonly: false,
    clearable: false,
    status: 'primary',
    holidays: () => [],
    showHolidays: true,
  },
);
const emit = defineEmits<{
  'update:modelValue': [value: ZtDatePickerValue];
  change: [value: ZtDatePickerValue];
  clear: [];
  'visible-change': [visible: boolean];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();
const attrs = useAttrs();
const formItem = inject(ztFormItemKey, undefined);
const overlay = inject(overlayContextKey, undefined);
const root = ref<HTMLElement>();
const popup = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const visible = ref(props.inline);
const month = ref(
  calendarDate(new Date().getFullYear(), new Date().getMonth(), 1),
);
const start = ref('');
const end = ref('');
const startTime = ref('00:00:00');
const endTime = ref('23:59:59');
const pickingEnd = ref(false);
const hovered = ref('');
const active = ref('');
const position = ref({
  top: '0px',
  left: '0px',
  zIndex: 2000,
  maxHeight: '480px',
});
const id = `zt-date-picker-${getCurrentInstance()!.uid}`;
const disabled = computed(
  () => props.disabled || formItem?.disabled.value || false,
);
const size = useZtSize(props, () => formItem?.size.value);
const mode = computed(() => props.datetime ? 'date' : props.type?.startsWith('year') ? 'year' : props.type?.startsWith('month') ? 'month' : 'date');
const range = computed(() => props.range || Boolean(props.type?.endsWith('range')));
const periodLabel = computed(() => mode.value === 'year' ? '年份' : mode.value === 'month' ? '月份' : '日期');
function parseValue(value: string | undefined) {
  if (mode.value === 'year') return /^\d{4}$/.test(value ?? '') ? parseDate(`${value}-01-01`) : null;
  if (mode.value === 'month') return /^\d{4}-\d{2}$/.test(value ?? '') ? parseDate(`${value}-01`) : null;
  return parseDate(value, props.datetime);
}
function periodKey(date: Date) { return dateKey(date).slice(0, mode.value === 'year' ? 4 : mode.value === 'month' ? 7 : 10); }
const placeholder = computed(
  () =>
    props.placeholder ??
    (range.value
      ? props.datetime
        ? '请选择日期时间范围'
        : `请选择${periodLabel.value}范围`
      : props.datetime
        ? '请选择日期时间'
        : `请选择${periodLabel.value}`),
);
const values = computed(() => {
  const value = props.modelValue;
  if (range.value)
    return Array.isArray(value) &&
      value.length === 2 &&
      value.every((v) => parseValue(v))
      ? value
      : [];
  return typeof value === 'string' && parseValue(value)
    ? [value]
    : [];
});
const displayValue = computed(() => values.value.join(' 至 '));
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const holidayMap = computed(() => {
  const entries = props.showHolidays ? props.holidays : [];
  return new Map(
    entries
      .filter((item) => parseDate(item.key) && item.value.trim())
      .map((item) => [item.key, item.value] as const),
  );
});
const calendars = computed(() =>
  Array.from({ length: range.value && mode.value === 'date' ? 2 : 1 }, (_, index) => {
    const value = calendarDate(
      month.value.getFullYear(),
      month.value.getMonth() + index,
      1,
    );
    return {
      month: value,
      days: monthDays(value).map((date) => ({
        date,
        key: dateKey(date),
        holiday: holidayMap.value.get(dateKey(date)),
        outside: date.getMonth() !== value.getMonth(),
      })),
    };
  }),
);
function clampMonth(value: Date) {
  const min = calendarDate(1, 0, 1);
  const max = calendarDate(9999, range.value && mode.value === 'date' ? 10 : 11, 1);
  return new Date(
    Math.max(min.getTime(), Math.min(max.getTime(), value.getTime())),
  );
}
const previewEnd = computed(() =>
  pickingEnd.value ? hovered.value : end.value,
);
const bounds = computed(() => [start.value, previewEnd.value].sort());
const draft = computed<ZtDatePickerValue>(() => {
  const first =
    start.value + (props.datetime ? ` ${normalizeTime(startTime.value)}` : '');
  const last =
    end.value + (props.datetime ? ` ${normalizeTime(endTime.value)}` : '');
  if (!parseValue(first) || isDisabled(parseValue(first)))
    return null;
  if (!range.value) return first;
  if (
    pickingEnd.value ||
    !parseValue(last) ||
    isDisabled(parseValue(last)) ||
    first > last
  )
    return null;
  return [first, last];
});
function isDisabled(date: Date | null) {
  return (
    !date ||
    date.getFullYear() < 1 ||
    date.getFullYear() > 9999 ||
    Boolean(props.disabledDate?.(new Date(date)))
  );
}
function resetDraft() {
  start.value = values.value[0]?.slice(0, 10) ?? '';
  end.value = values.value[1]?.slice(0, 10) ?? '';
  startTime.value = values.value[0]?.slice(11) || '00:00:00';
  endTime.value = values.value[1]?.slice(11) || '23:59:59';
  pickingEnd.value = false;
  hovered.value = '';
  const date = parseValue(values.value[0]) ?? new Date();
  active.value = dateKey(date);
  month.value = clampMonth(
    calendarDate(date.getFullYear(), date.getMonth(), 1),
  );
}
function updatePosition() {
  if (props.inline || !root.value || !popup.value) return;
  const rect = root.value.getBoundingClientRect();
  const panel = popup.value.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom - 14;
  const above = rect.top - 14;
  const upward = below < panel.height && above > below;
  const available = Math.max(0, upward ? above : below);
  const parent = root.value.closest<HTMLElement>('.zt-modal, .zt-drawer');
  const layer = parent
    ? Number.parseFloat(parent.style.zIndex || getComputedStyle(parent).zIndex)
    : 0;
  position.value = {
    top: `${Math.max(8, upward ? rect.top - Math.min(panel.height, available) - 6 : rect.bottom + 6)}px`,
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - panel.width - 8))}px`,
    zIndex: Number.isFinite(layer)
      ? Math.max(2000, Math.floor(layer) + 1)
      : 2000,
    maxHeight: `${available}px`,
  };
}
function outside(event: MouseEvent) {
  // A navigation click can replace its target before it bubbles to document.
  const path = event.composedPath();
  if (
    (root.value && path.includes(root.value)) ||
    (popup.value && path.includes(popup.value))
  )
    return;
  if (
    event.target instanceof Node &&
    !root.value?.contains(event.target) &&
    !popup.value?.contains(event.target)
  )
    close();
}
function open() {
  if (props.inline) return;
  if (
    disabled.value ||
    props.readonly ||
    overlay?.interactive.value === false ||
    visible.value
  )
    return;
  resetDraft();
  visible.value = true;
  document.addEventListener('click', outside);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  emit('visible-change', true);
  void nextTick(updatePosition);
}
function cleanup() {
  document.removeEventListener('click', outside);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
}
function close() {
  if (props.inline) return;
  if (!visible.value) return;
  visible.value = false;
  cleanup();
  emit('visible-change', false);
}
function focus(options?: FocusOptions) {
  input.value?.focus(options);
}
function blur() {
  input.value?.blur();
  close();
}
function commit(value: ZtDatePickerValue) {
  emit('update:modelValue', value);
  emit('change', value);
  void nextTick(() => formItem?.validate('change'));
  close();
  focus();
}
function clear() {
  if (disabled.value || props.readonly || !displayValue.value) return;
  commit(null);
  emit('clear');
}
function selectDay(date: Date) {
  if (disabled.value || props.readonly || isDisabled(date)) return;
  const key = periodKey(date);
  active.value = key;
  if (range.value) {
    if (!pickingEnd.value) {
      start.value = key;
      end.value = '';
      pickingEnd.value = true;
      hovered.value = '';
    } else {
      const sorted = [start.value, key].sort();
      start.value = sorted[0];
      end.value = sorted[1];
      pickingEnd.value = false;
    }
  } else start.value = key;
  if (!props.datetime && draft.value !== null) commit(draft.value);
}
function confirm() {
  if (!disabled.value && !props.readonly && draft.value !== null)
    commit(draft.value);
}
function setMonth(value: Date, index = 0) {
  month.value = clampMonth(
    calendarDate(value.getFullYear(), value.getMonth() - index, 1),
  );
  active.value = dateKey(value);
  void nextTick(updatePosition);
}
async function focusDay() {
  await nextTick();
  if (mode.value !== 'date') {
    (popup.value?.querySelector<HTMLButtonElement>('.zt-date-picker__period-grid button[tabindex="0"]:not(:disabled)') ?? popup.value?.querySelector<HTMLButtonElement>('.zt-date-picker__period-grid button:not(:disabled)'))?.focus();
    return;
  }
  const target =
    popup.value?.querySelector<HTMLButtonElement>(
      `[data-date="${active.value}"]:not(:disabled)`,
    ) ??
    popup.value?.querySelector<HTMLButtonElement>('[data-date]:not(:disabled)');
  if (target) {
    active.value = target.dataset.date!;
    target.focus();
  } else
    popup.value
      ?.querySelector<HTMLButtonElement>('[aria-label="选择年份"]')
      ?.focus();
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    event.stopPropagation();
    close();
    focus();
    return;
  }
  if (
    event.target === input.value &&
    ['Enter', ' ', 'ArrowDown'].includes(event.key)
  ) {
    event.preventDefault();
    open();
    void focusDay();
    return;
  }
  if (!(event.target instanceof HTMLElement) || !event.target.dataset.date)
    return;
  const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[
    event.key
  ];
  if (offset === undefined) return;
  event.preventDefault();
  let date = parseDate(event.target.dataset.date)!;
  for (let i = 0; i < 3660; i++) {
    date = addDays(date, offset);
    if (date.getFullYear() < 1 || date.getFullYear() > 9999) return;
    if (!isDisabled(date)) {
      active.value = dateKey(date);
      const targetMonth = calendarDate(date.getFullYear(), date.getMonth(), 1);
      const lastMonth = calendars.value[calendars.value.length - 1]!.month;
      if (targetMonth < month.value) month.value = clampMonth(targetMonth);
      else if (targetMonth > lastMonth)
        month.value = clampMonth(
          calendarDate(
            date.getFullYear(),
            date.getMonth() - (range.value ? 1 : 0),
            1,
          ),
        );
      void focusDay();
      return;
    }
  }
}
function keepButtonFocus(event: MouseEvent) {
  // Pointer selection must not blur the input before the button's click runs (Safari).
  if (event.target instanceof Element && event.target.closest('button'))
    event.preventDefault();
}
async function focusout(event: FocusEvent) {
  // View changes may remove the focused button before its replacement is focused.
  if (!event.relatedTarget) await nextTick();
  const target = event.relatedTarget ?? document.activeElement;
  if (
    target instanceof Node &&
    (root.value?.contains(target) || popup.value?.contains(target))
  )
    return;
  close();
  emit('blur', event);
  void formItem?.validate('blur');
}
const unregister = props.inline
  ? undefined
  : overlay?.registerBranch({
      trigger: root,
      popup,
      visible,
      close,
      focus,
      tabThroughPopup: true,
    });
watch(
  () => overlay?.interactive.value,
  (value) => {
    if (value === false) close();
  },
);
watch(size, () => {
  if (visible.value) void nextTick(updatePosition);
});
watch([disabled, () => props.readonly], ([off, readonly]) => {
  if (off || readonly) close();
});
watch(
  [() => props.modelValue, range, mode, () => props.datetime],
  () => {
    if (visible.value) resetDraft();
  },
  { deep: true },
);
if (props.inline) resetDraft();
onBeforeUnmount(() => {
  cleanup();
  unregister?.();
});
defineExpose({ focus, blur, open, close, clear });
</script>

<template>
  <div
    v-if="!inline"
    ref="root"
    :class="[
      'zt-date-picker',
      `zt-date-picker--${size}`,
      `zt-date-picker--status-${status}`,
      {
        'is-disabled': disabled,
        'is-open': visible,
        'has-clear': clearable && displayValue && !disabled && !readonly,
        'is-range': range,
        'is-error': formItem?.validateState.value === 'error',
      },
      attrs.class,
    ]"
    :style="attrs.style"
    @keydown="keydown"
    @focusout="focusout"
  >
    <svg
      class="zt-date-picker__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v4m10-4v4M3 11h18" />
    </svg>
    <input
      ref="input"
      v-bind="inputAttrs"
      :id="String(attrs.id ?? formItem?.inputId ?? id)"
      :value="displayValue"
      :placeholder="placeholder"
      readonly
      :disabled="disabled"
      :aria-readonly="readonly"
      :aria-label="
        (attrs['aria-label'] as string) ??
        (!formItem && !attrs['aria-labelledby'] ? placeholder : undefined)
      "
      role="combobox"
      aria-haspopup="dialog"
      :aria-expanded="visible"
      :aria-controls="`${id}-popup`"
      :aria-invalid="
        status === 'error' || formItem?.validateState.value === 'error'
          ? 'true'
          : undefined
      "
      :aria-describedby="
        (attrs['aria-describedby'] as string) ??
        (formItem?.validateMessage.value ? formItem.errorId : undefined)
      "
      @click="visible ? close() : open()"
      @focus="emit('focus', $event)"
    />
    <button
      v-if="clearable && displayValue && !disabled && !readonly"
      class="zt-date-picker__clear"
      type="button"
      aria-label="清空日期"
      @mousedown.prevent
      @click.stop="clear"
    >
      ×
    </button>
  </div>
  <Teleport to="body" :disabled="inline">
    <div
      v-if="visible"
      :id="`${id}-popup`"
      ref="popup"
      class="zt-date-picker__panel"
      :class="[
        `zt-date-picker--status-${status}`,
        `zt-date-picker--${size}`,
        { 'is-range': range && mode === 'date' },
      ]"
      :role="inline ? 'group' : 'dialog'"
      :aria-label="placeholder"
      :style="[
        providerStyle,
        inline ? { position: 'relative', maxWidth: '100%' } : position,
      ]"
      @mousedown="keepButtonFocus"
      @keydown="keydown"
      @focusout="focusout"
    >
      <p v-if="range" class="zt-date-picker__hint" aria-live="polite">
        {{ `请选择${pickingEnd ? '结束' : '开始'}${periodLabel}` }}
      </p>
      <div class="zt-date-picker__calendars">
        <section
          v-for="(calendar, index) in calendars"
          :key="index"
          class="zt-date-picker__calendar"
          :data-calendar="index"
          :aria-label="`${calendar.month.getFullYear()}年${calendar.month.getMonth() + 1}月`"
        >
          <ZtCalendarNavigation
            :key="mode"
            :model-value="calendar.month"
            :mode="mode"
            :period-disabled="date => disabled || readonly || isDisabled(date)"
            :selected="date => periodKey(date) === start || periodKey(date) === end"
            :in-range="date => Boolean(range && bounds[0] && periodKey(date) > bounds[0] && periodKey(date) < bounds[1])"
            @pick="selectDay"
            @hover="hovered = $event ? periodKey($event) : ''"
            @update:model-value="setMonth($event, index)"
            @select="focusDay"
            @view-change="updatePosition"
          >
            <div class="zt-date-picker__week">
              <span
                v-for="label in ['一', '二', '三', '四', '五', '六', '日']"
                :key="label"
                >{{ label }}</span
              >
            </div>
            <div class="zt-date-picker__days" @mouseleave="hovered = ''">
              <template
                v-for="{ date, key, holiday, outside } in calendar.days"
                :key="key"
              >
                <span
                  v-if="range && outside"
                  class="zt-date-picker__empty-day"
                  aria-hidden="true"
                />
                <button
                  v-else
                  type="button"
                  :data-date="key"
                  :aria-label="holiday ? `${key} ${holiday}` : key"
                  :title="holiday"
                  :aria-pressed="key === start || key === end"
                  :aria-current="
                    key === dateKey(new Date()) ? 'date' : undefined
                  "
                  :tabindex="key === active ? 0 : -1"
                  :disabled="disabled || readonly || isDisabled(date)"
                  :class="{
                    'is-other': outside,
                    'is-selected': key === start || key === end,
                    'is-in-range':
                      range && bounds[0] && key > bounds[0] && key < bounds[1],
                    'is-today': key === dateKey(new Date()),
                    'has-holiday': Boolean(holiday),
                  }"
                  @mouseenter="hovered = key"
                  @focus="active = key"
                  @click="selectDay(date)"
                >
                  <span class="zt-date-picker__day-number">{{
                    date.getDate()
                  }}</span>
                  <span
                    v-if="holiday"
                    class="zt-date-picker__holiday"
                    aria-hidden="true"
                    >{{ holiday }}</span
                  >
                </button>
              </template>
            </div>
          </ZtCalendarNavigation>
        </section>
      </div>
      <div v-if="datetime" class="zt-date-picker__time">
        <label
          >{{ range ? '开始时间' : '时间'
          }}<input
            v-model="startTime"
            type="time"
            step="1"
            :aria-label="range ? '开始时间' : '时间'"
        /></label>
        <label v-if="range"
          >结束时间<input
            v-model="endTime"
            type="time"
            step="1"
            aria-label="结束时间"
        /></label>
      </div>
      <footer v-if="!inline || datetime" class="zt-date-picker__footer">
        <span v-if="range" class="zt-date-picker__summary"
          >{{ start || `开始${periodLabel}` }} 至 {{ end || `结束${periodLabel}` }}</span
        >
        <button
          type="button"
          @click="
            close();
            focus();
          "
        >
          取消
        </button>
        <button
          v-if="datetime"
          type="button"
          data-action="confirm"
          class="zt-date-picker__confirm"
          :disabled="draft === null"
          @click="confirm"
        >
          确定
        </button>
      </footer>
    </div>
  </Teleport>
</template>
