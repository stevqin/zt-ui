<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useZtSize } from '../config-provider/context'
import { ztFormItemKey } from '../form/context'
import type { ZtSliderProps, ZtSliderValue } from './types'
import { snapSliderValue } from './slider'
import './slider.scss'
defineOptions({ name: 'ZtSlider', inheritAttrs: false })
const props = withDefaults(defineProps<ZtSliderProps>(), { modelValue: 0, min: 0, max: 100, step: 1, range: false, disabled: false, status: 'primary', showTooltip: true })
const emit = defineEmits<{
  'update:modelValue': [value: ZtSliderValue]
  input: [value: ZtSliderValue]
  change: [value: ZtSliderValue]
}>()
const form = inject(ztFormItemKey, undefined)
const size = useZtSize(props, () => form?.size.value)
const min = computed(() => Number.isFinite(props.min) ? props.min : 0)
const max = computed(() => Number.isFinite(props.max) ? Math.max(min.value, props.max) : min.value)
const step = computed(() => Number.isFinite(props.step) && props.step > 0 ? props.step : 1)
const disabled = computed(() => props.disabled || form?.disabled.value || max.value <= min.value)
function snap(value: number) { return snapSliderValue(value, min.value, max.value, step.value) }
const draft = ref<number[]>([])
watch(() => [props.modelValue, props.range, props.min, props.max, props.step], () => {
  const value = props.modelValue
  draft.value = props.range ? (Array.isArray(value) ? value.map(snap).sort((a,b) => a-b) : [min.value, snap(value)]) : [snap(Array.isArray(value) ? value[0] : value)]
}, { immediate: true, deep: true })
const track = ref<HTMLElement>()
const thumbs = ref<HTMLButtonElement[]>([])
const active = ref<number | null>(null)
let pointerId: number | null = null
let startValue = ''
const percent = (value: number) => max.value <= min.value ? 0 : (value-min.value)/(max.value-min.value)*100
const fill = computed(() => ({ left: `${props.range ? percent(draft.value[0]!) : 0}%`, width: `${props.range ? percent(draft.value[1]!)-percent(draft.value[0]!) : percent(draft.value[0]!)}%` }))
const text = (value: number) => props.formatTooltip?.(value) ?? String(value)
function value(): ZtSliderValue { return props.range ? [draft.value[0]!, draft.value[1]!] : draft.value[0]! }
function update(index: number, next: number) {
  next = snap(next)
  if (props.range) next = index === 0 ? Math.min(next, draft.value[1]!) : Math.max(next, draft.value[0]!)
  if (next === draft.value[index]) return
  draft.value[index] = next
  emit('update:modelValue', value()); emit('input', value())
}
function commit() { emit('change', value()); void form?.validate('change') }
function atPointer(event: PointerEvent) {
  const bounds = track.value!.getBoundingClientRect()
  return bounds.width ? min.value + (event.clientX-bounds.left)/bounds.width*(max.value-min.value) : min.value
}
function down(event: PointerEvent) {
  if (disabled.value || event.button !== 0 || pointerId !== null) return
  event.preventDefault()
  const thumb = (event.target as HTMLElement).closest<HTMLElement>('[data-thumb]')
  const next = atPointer(event)
  const nearest = props.range && (draft.value[0] === draft.value[1] ? next >= draft.value[0]! : Math.abs(next-draft.value[1]!) < Math.abs(next-draft.value[0]!)) ? 1 : 0
  const index = thumb ? Number(thumb.dataset.thumb) : nearest
  active.value = index; pointerId = event.pointerId; startValue = JSON.stringify(value())
  track.value?.setPointerCapture?.(event.pointerId)
  thumbs.value[index]?.focus({ preventScroll: true })
  update(index, next)
}
function move(event: PointerEvent) { if (!disabled.value && pointerId === event.pointerId && active.value !== null) update(active.value, atPointer(event)) }
function up(event: PointerEvent) {
  if (pointerId !== event.pointerId) return
  pointerId = null; active.value = null
  if (JSON.stringify(value()) !== startValue) commit()
}
function key(event: KeyboardEvent, index: number) {
  if (disabled.value) return
  const current = draft.value[index]!
  const options: Record<string, number> = { ArrowRight: current+step.value, ArrowUp: current+step.value, ArrowLeft: current-step.value, ArrowDown: current-step.value, Home: min.value, End: max.value, PageUp: current+step.value*10, PageDown: current-step.value*10 }
  if (!(event.key in options)) return
  event.preventDefault()
  const before = JSON.stringify(value()); update(index, options[event.key]!)
  if (before !== JSON.stringify(value())) commit()
}
</script>
<template>
 <div class="zt-slider" :class="[`zt-slider--${size}`, `zt-slider--status-${status}`, { 'is-disabled':disabled, 'is-dragging':active!==null }]" v-bind="$attrs">
  <div ref="track" class="zt-slider__track" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @lostpointercapture="up">
   <span class="zt-slider__rail" /><span class="zt-slider__fill" :style="fill" />
   <button v-for="(number,index) in draft" :key="index" ref="thumbs" type="button" role="slider" class="zt-slider__thumb" :data-thumb="index" :id="index===0 ? form?.inputId : undefined" :disabled="disabled" :aria-disabled="disabled" :aria-label="range ? `${ariaLabel ?? '范围'}${index===0?'起点':'终点'}` : ariaLabel ?? (form ? undefined : '滑块')" :aria-valuemin="range && index===1 ? draft[0] : min" :aria-valuemax="range && index===0 ? draft[1] : max" :aria-valuenow="number" :aria-valuetext="text(number)" :aria-describedby="form?.validateState.value==='error' ? form.errorId : undefined" :style="{left:`${percent(number)}%`}" @keydown="key($event,index)">
    <span v-if="showTooltip" class="zt-slider__tooltip" aria-hidden="true">{{text(number)}}</span>
   </button>
  </div>
 </div>
</template>
