<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import {
  calendarDate,
  dateKey,
  parseDate,
  addDays,
  monthDays,
} from '../date-picker/date';
import type { ZtCalendarProps, ZtCalendarView, ZtCalendarCell } from './types';
import './calendar.scss';
defineOptions({ name: 'ZtCalendar' });
const props = withDefaults(defineProps<ZtCalendarProps>(), {
  modelValue: null,
  holidays: () => [],
});
const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string, date: Date];
  'update:view': [view: ZtCalendarView];
  'panel-change': [date: string, view: ZtCalendarView];
}>();
const config = useZtConfig(),
  size = useZtSize(props),
  today = ref(
    calendarDate(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  ),
  anchor = ref(parseDate(props.modelValue ?? undefined) ?? today.value),
  localView = ref<ZtCalendarView>('month'),
  view = computed(() => props.view ?? localView.value),
  root = ref<HTMLElement>(),
  focusDate = ref(dateKey(anchor.value));
// Refresh "today" when the calendar day rolls over.
let dayTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  const schedule = () => {
    const now = new Date()
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    dayTimer = setTimeout(() => {
      today.value = calendarDate(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      )
      schedule()
    }, Math.max(1000, next.getTime() - now.getTime()))
  }
  schedule()
})
onBeforeUnmount(() => clearTimeout(dayTimer))
watch(
  () => props.modelValue,
  (value) => {
    const parsed = parseDate(value ?? undefined);
    if (parsed) {
      anchor.value = parsed;
      focusDate.value = dateKey(parsed);
    }
  },
);
const bounds = computed(() =>
  props.range
    ? [parseDate(props.range[0]), parseDate(props.range[1])]
    : undefined,
);
function disabled(date: Date) {
  if (props.disabled || props.disabledDate?.(date)) return true;
  const range = bounds.value;
  if (
    range &&
    (!range[0] ||
      !range[1] ||
      range[0] > range[1] ||
      date < range[0] ||
      date > range[1])
  )
    return true;
  return false;
}
const days = computed(() =>
  view.value === 'month'
    ? monthDays(anchor.value)
    : Array.from({ length: 7 }, (_, i) =>
        addDays(anchor.value, i - ((anchor.value.getDay() + 6) % 7)),
      ),
);
function cell(date: Date): ZtCalendarCell {
  const day = dateKey(date);
  return {
    date,
    day,
    selected: props.modelValue === day,
    currentMonth: date.getMonth() === anchor.value.getMonth(),
    disabled: disabled(date),
    holiday: props.holidays.find((h) => h.key === day)?.value,
  };
}
function select(date: Date) {
  if (disabled(date)) return;
  const value = dateKey(date);
  emit('update:modelValue', value);
  emit('change', value, new Date(date));
  focusDate.value = value;
}
function panel(date: Date) {
  anchor.value = date;
  focusDate.value = dateKey(date);
  emit('panel-change', dateKey(date), view.value);
}
function navigate(direction: number) {
  panel(
    view.value === 'month'
      ? calendarDate(
          anchor.value.getFullYear(),
          anchor.value.getMonth() + direction,
          1,
        )
      : addDays(anchor.value, direction * 7),
  );
}
function setView(value: ZtCalendarView) {
  localView.value = value;
  emit('update:view', value);
  emit('panel-change', dateKey(anchor.value), value);
}
async function keyboard(e: KeyboardEvent, date: Date) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
    Home: -((date.getDay() + 6) % 7),
    End: 6 - ((date.getDay() + 6) % 7),
  };
  if (!(e.key in steps) && e.key !== 'PageUp' && e.key !== 'PageDown') return;
  e.preventDefault();
  let target =
    e.key === 'PageUp' || e.key === 'PageDown'
      ? calendarDate(
          date.getFullYear(),
          date.getMonth() + (e.key === 'PageUp' ? -1 : 1),
          Math.min(
            date.getDate(),
            calendarDate(
              date.getFullYear(),
              date.getMonth() + (e.key === 'PageUp' ? 0 : 2),
              0,
            ).getDate(),
          ),
        )
      : addDays(date, steps[e.key]!);
  if (disabled(target)) return;
  focusDate.value = dateKey(target);
  if (!days.value.some((d) => dateKey(d) === focusDate.value)) panel(target);
  await nextTick();
  root.value
    ?.querySelector<HTMLButtonElement>(`[data-date="${dateKey(target)}"]`)
    ?.focus();
}
const tabDate = computed(() =>
  days.value.some((d) => dateKey(d) === focusDate.value && !disabled(d))
    ? focusDate.value
    : dateKey(days.value.find((d) => !disabled(d)) ?? days.value[0]!),
);
</script>
<template>
  <section
    ref="root"
    class="zt-calendar"
    :class="`zt-calendar--${size}`"
    :style="config.style.value"
  >
    <header class="zt-calendar__header">
      <slot
        name="header"
        :date="dateKey(anchor)"
        :view="view"
        :navigate="navigate"
        ><strong aria-live="polite"
          >{{ anchor.getFullYear() }} 年 {{ anchor.getMonth() + 1 }} 月</strong
        >
        <div class="zt-calendar__toolbar">
          <button
            type="button"
            :disabled="props.disabled"
            :aria-label="view === 'month' ? '上个月' : '上一周'"
            @click="navigate(-1)"
          >
            ‹</button
          ><button
            type="button"
            :disabled="props.disabled"
            @click="panel(today)"
          >
            今天</button
          ><button
            type="button"
            :disabled="props.disabled"
            :aria-label="view === 'month' ? '下个月' : '下一周'"
            @click="navigate(1)"
          >
            ›</button
          ><button
            type="button"
            :disabled="props.disabled"
            :aria-pressed="view === 'month'"
            @click="setView('month')"
          >
            月</button
          ><button
            type="button"
            :disabled="props.disabled"
            :aria-pressed="view === 'week'"
            @click="setView('week')"
          >
            周
          </button>
        </div></slot
      >
    </header>
    <div class="zt-calendar__weekdays" aria-hidden="true">
      <span
        v-for="day in ['一', '二', '三', '四', '五', '六', '日']"
        :key="day"
        >{{ day }}</span
      >
    </div>
    <div
      class="zt-calendar__grid"
      role="group"
      :aria-label="view === 'month' ? '月日历' : '周日历'"
    >
      <button
        v-for="date in days"
        :key="dateKey(date)"
        :data-date="dateKey(date)"
        type="button"
        class="zt-calendar__cell"
        :class="{
          'is-outside': date.getMonth() !== anchor.getMonth(),
          'is-selected': modelValue === dateKey(date),
          'is-today': dateKey(date) === dateKey(today),
        }"
        :disabled="disabled(date)"
        :tabindex="dateKey(date) === tabDate ? 0 : -1"
        :aria-label="`${dateKey(date)} ${cell(date).holiday ?? ''}`"
        :aria-pressed="modelValue === dateKey(date)"
        :aria-current="dateKey(date) === dateKey(today) ? 'date' : undefined"
        @click="select(date)"
        @keydown="keyboard($event, date)"
      >
        <slot name="date-cell" v-bind="cell(date)"
          ><span>{{ date.getDate() }}</span
          ><small v-if="cell(date).holiday">{{
            cell(date).holiday
          }}</small></slot
        >
      </button>
    </div>
  </section>
</template>
