<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useZtSize } from '../config-provider/context'
import ZtIcon from '../icon/ZtIcon.vue'
import type { ZtSegmentedOption, ZtSegmentedProps, ZtSegmentedValue } from './types'
import './segmented.scss'
defineOptions({ name: 'ZtSegmented' })
const props = withDefaults(defineProps<ZtSegmentedProps>(), { disabled: false, block: false, status: 'primary', ariaLabel: '分段控制器' })
const emit = defineEmits<{ 'update:modelValue': [value: ZtSegmentedValue]; change: [value: ZtSegmentedValue] }>()
const size = useZtSize(props), root = ref<HTMLElement>()
const normalized = computed<ZtSegmentedOption[]>(() => props.options.map(option => typeof option === 'object' && option !== null ? option : { label: String(option), value: option }))
const indicatorStyle = ref<Record<string, string>>()
const animated = ref(false)
const activeDisabled = computed(() => props.disabled || normalized.value.find(option => option.value === props.modelValue)?.disabled)
let observer: ResizeObserver | undefined
let frame: number | undefined
let mounted = false

function measure() {
  const buttons = root.value?.querySelectorAll<HTMLElement>('[role="radio"]')
  const index = normalized.value.findIndex(option => option.value === props.modelValue)
  const button = buttons?.[index]
  if (!button || !button.offsetWidth || !button.offsetHeight) {
    indicatorStyle.value = undefined
    animated.value = false
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    return
  }
  const initial = !indicatorStyle.value
  indicatorStyle.value = {
    transform: `translateX(${button.offsetLeft}px)`, top: `${button.offsetTop}px`,
    width: `${button.offsetWidth}px`, height: `${button.offsetHeight}px`,
  }
  if (initial) {
    // Render the first position without a transition; only subsequent moves animate.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => { animated.value = true; frame = undefined })
    })
  }
}
function refresh() {
  if (!mounted) return
  observer?.disconnect()
  if (root.value) {
    observer?.observe(root.value)
    root.value.querySelectorAll<HTMLElement>('[role="radio"]').forEach(button => observer?.observe(button))
  }
  measure()
}
watch([() => props.modelValue, normalized, size, () => props.block, () => props.disabled], refresh, { flush: 'post', deep: true })
onMounted(() => {
  mounted = true
  if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(measure)
  window.addEventListener('resize', measure)
  refresh()
})
onBeforeUnmount(() => {
  mounted = false
  observer?.disconnect()
  window.removeEventListener('resize', measure)
  if (frame !== undefined) cancelAnimationFrame(frame)
})
function select(option: ZtSegmentedOption) { if (props.disabled || option.disabled || option.value === props.modelValue) return; emit('update:modelValue', option.value); emit('change', option.value) }
function key(index: number, event: KeyboardEvent) { if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return; event.preventDefault(); const enabled = normalized.value.map((o,i)=>({o,i})).filter(x=>!x.o.disabled); const current=enabled.findIndex(x=>x.i===index); const next=event.key==='Home'?0:event.key==='End'?enabled.length-1:['ArrowRight','ArrowDown'].includes(event.key)?(current+1)%enabled.length:(current-1+enabled.length)%enabled.length; const target=enabled[next]; if(target){select(target.o);void nextTick(()=>root.value?.querySelectorAll<HTMLElement>('[role="radio"]')[target.i]?.focus())} }
</script>
<template><div ref="root" class="zt-segmented" :class="[`zt-segmented--${size}`,`zt-segmented--status-${status}`,{'is-block':block,'is-disabled':disabled}]" role="radiogroup" :aria-label="ariaLabel"><span v-if="indicatorStyle" class="zt-segmented__indicator" :class="{'is-animated':animated,'is-disabled':activeDisabled}" :style="indicatorStyle" aria-hidden="true" /><button v-for="(option,index) in normalized" :key="String(option.value)" type="button" role="radio" :aria-checked="option.value===modelValue" :disabled="disabled||option.disabled" :tabindex="option.value===modelValue?0:-1" :class="{'is-active':option.value===modelValue}" @click="select(option)" @keydown="key(index,$event)"><ZtIcon v-if="option.icon" :name="typeof option.icon==='string'?option.icon:undefined" :component="typeof option.icon==='string'?undefined:option.icon"/><span>{{option.label}}</span></button></div></template>
