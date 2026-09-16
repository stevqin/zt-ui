<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { calendarDate } from './date'

const props = defineProps<{ modelValue: Date }>()
const emit = defineEmits<{
  'update:modelValue': [value: Date]
  select: []
  'view-change': []
}>()
const root = ref<HTMLElement>()
const view = ref<'date' | 'year' | 'month'>('date')
const decade = ref(0)
const focused = ref(0)
watch(view, async () => { await nextTick(); emit('view-change') })
const year = computed(() => props.modelValue.getFullYear())
const month = computed(() => props.modelValue.getMonth())
const years = computed(() => Array.from({ length: 12 }, (_, index) => decade.value - 1 + index))
const yearAllowed = (value: number) => value >= 1 && value <= 9999
const canMoveMonth = (offset: number) => yearAllowed(calendarDate(year.value, month.value + offset, 1).getFullYear())

function moveMonth(offset: number) {
  if (canMoveMonth(offset)) emit('update:modelValue', calendarDate(year.value, month.value + offset, 1))
}
async function focusChoice() {
  await nextTick()
  root.value?.querySelector<HTMLButtonElement>(`[data-${view.value}="${focused.value}"]:not(:disabled)`)?.focus()
}
function retainFocus() {
  // Keep focus inside the popup before Vue removes the active grid/button.
  // Browsers may otherwise dispatch focusout to body during DOM replacement.
  root.value?.focus({ preventScroll: true })
}
function showYears() {
  retainFocus()
  view.value = 'year'
  decade.value = Math.floor(year.value / 10) * 10
  focused.value = year.value
  void focusChoice()
}
function showMonths() {
  retainFocus()
  view.value = 'month'
  focused.value = month.value
  void focusChoice()
}
function pageYears(direction: number) {
  const next = decade.value + direction * 10
  if (next < 0 || next > 9990) return
  retainFocus()
  decade.value = next
  focused.value = Math.max(1, Math.min(9999, focused.value + direction * 10))
  void focusChoice()
}
function pickYear(value: number) {
  if (!yearAllowed(value)) return
  emit('update:modelValue', calendarDate(value, month.value, 1))
  showMonths()
}
function pickMonth(value: number) {
  retainFocus()
  emit('update:modelValue', calendarDate(year.value, value, 1))
  view.value = 'date'
  emit('select')
}
async function returnToDates() {
  retainFocus()
  view.value = 'date'
  await nextTick()
  root.value?.querySelector<HTMLButtonElement>('[aria-label="选择年份"]')?.focus()
}
function keydown(event: KeyboardEvent) {
  if (view.value === 'date' || event.isComposing || !(event.target instanceof HTMLElement)) return
  const value = event.target.dataset[view.value]
  if (value === undefined) return
  const current = Number(value)
  const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[event.key]
  let next: number
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    const direction = event.key === 'PageUp' ? -1 : 1
    if (view.value === 'year') pageYears(direction)
    else { moveMonth(direction * 12); void focusChoice() }
    return
  }
  if (event.key === 'Home') next = view.value === 'year' ? Math.max(1, decade.value - 1) : 0
  else if (event.key === 'End') next = view.value === 'year' ? Math.min(9999, decade.value + 10) : 11
  else if (offset !== undefined) next = current + offset
  else return
  event.preventDefault()
  if (view.value === 'year') {
    if (!yearAllowed(next)) return
    if (next < decade.value - 1 || next > decade.value + 10) decade.value = Math.floor(next / 10) * 10
  } else if (next < 0 || next > 11) return
  retainFocus()
  focused.value = next
  void focusChoice()
}
</script>

<template>
  <div ref="root" class="zt-date-picker__navigation" tabindex="-1" @keydown="keydown">
    <header class="zt-date-picker__header">
      <template v-if="view === 'date'">
        <button type="button" aria-label="上一年" :disabled="!canMoveMonth(-12)" @click="moveMonth(-12)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 7-5 5 5 5m7-10-5 5 5 5" /></svg></button>
        <button type="button" aria-label="上个月" :disabled="!canMoveMonth(-1)" @click="moveMonth(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg></button>
        <div class="zt-date-picker__heading">
          <button type="button" class="zt-date-picker__heading-button" aria-label="选择年份" @click="showYears">{{ year }}年<span class="zt-date-picker__chevron" /></button>
          <button type="button" class="zt-date-picker__heading-button" aria-label="选择月份" @click="showMonths">{{ month + 1 }}月<span class="zt-date-picker__chevron" /></button>
        </div>
        <button type="button" aria-label="下个月" :disabled="!canMoveMonth(1)" @click="moveMonth(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg></button>
        <button type="button" aria-label="下一年" :disabled="!canMoveMonth(12)" @click="moveMonth(12)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 7 5 5-5 5m7-10 5 5-5 5" /></svg></button>
      </template>
      <template v-else>
        <button type="button" :aria-label="view === 'year' ? '前十年' : '上一年'" :disabled="view === 'year' ? decade <= 0 : !canMoveMonth(-12)" @click="view === 'year' ? pageYears(-1) : moveMonth(-12)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg></button>
        <span v-if="view === 'year'" class="zt-date-picker__period" aria-live="polite">{{ Math.max(1, decade) }} — {{ Math.min(9999, decade + 9) }}</span>
        <button v-else type="button" class="zt-date-picker__heading-button" aria-label="选择年份" @click="showYears">{{ year }}年<span class="zt-date-picker__chevron" /></button>
        <button type="button" :aria-label="view === 'year' ? '后十年' : '下一年'" :disabled="view === 'year' ? decade >= 9990 : !canMoveMonth(12)" @click="view === 'year' ? pageYears(1) : moveMonth(12)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg></button>
      </template>
    </header>
    <slot v-if="view === 'date'" />
    <template v-else>
      <p class="zt-date-picker__navigation-hint">{{ view === 'year' ? '选择年份' : '选择月份' }}</p>
      <div class="zt-date-picker__period-grid" :aria-label="view === 'year' ? '年份' : '月份'" role="group">
        <template v-if="view === 'year'">
          <button v-for="item in years" :key="item" type="button" :data-year="item" :aria-label="`${item}年`" :aria-pressed="item === year" :disabled="!yearAllowed(item)" :tabindex="item === focused ? 0 : -1" :class="{ 'is-selected': item === year, 'is-adjacent': item < decade || item > decade + 9 }" @focus="focused = item" @click="pickYear(item)">{{ yearAllowed(item) ? item : '—' }}</button>
        </template>
        <template v-else>
          <button v-for="item in 12" :key="item" type="button" :data-month="item - 1" :aria-label="`${item}月`" :aria-pressed="item - 1 === month" :tabindex="item - 1 === focused ? 0 : -1" :class="{ 'is-selected': item - 1 === month }" @focus="focused = item - 1" @click="pickMonth(item - 1)">{{ item }}月</button>
        </template>
      </div>
      <button type="button" class="zt-date-picker__back" @click="returnToDates">返回日期</button>
    </template>
  </div>
</template>
