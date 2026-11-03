<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRaw, useSlots, watch, watchEffect } from 'vue'
import { iconComponents, warnUnknownIcon } from './icons'
import type { ZtIconProps } from './types'
import './icon.scss'

defineOptions({ name: 'ZtIcon', inheritAttrs: false })
const props = withDefaults(defineProps<ZtIconProps>(), {
  status: 'default', spin: false, strokeWidth: 2, label: '', animationTrigger: 'always',
})
const slots = useSlots()
const root = ref<HTMLElement>()
const animating = ref(false)
let replay = 0
const animation = computed(() => props.spin ? undefined : props.animation)
const cssSize = computed(() => {
  if (typeof props.size === 'number') return Number.isFinite(props.size) && props.size > 0 ? `${props.size}px` : '1em'
  return typeof props.size === 'string' && props.size.trim() ? props.size.trim() : '1em'
})
const rotation = computed(() => Number.isFinite(props.rotate) ? `${props.rotate}deg` : '0deg')
const resolved = computed(() => props.component ? toRaw(props.component) : (props.name ? iconComponents[props.name] : undefined))
watchEffect(() => {
  if (import.meta.env.DEV && props.name && !iconComponents[props.name] && !slots.default && !props.component) warnUnknownIcon(props.name)
})
const classes = computed(() => [
  'zt-icon-glyph', `zt-icon-glyph--status-${props.status}`,
  animation.value && `zt-icon-glyph--animation-${animation.value}`,
  animation.value && `zt-icon-glyph--trigger-${props.animationTrigger}`,
  { 'is-spin': props.spin, 'is-animating': animating.value },
])
const style = computed(() => ({ '--zt-icon-size': cssSize.value, '--zt-icon-color': props.color, '--zt-icon-rotate': rotation.value }))

async function play() {
  if (!animation.value || props.animationTrigger !== 'click') return
  const current = ++replay
  animating.value = false
  await nextTick()
  if (current !== replay || !root.value) return
  // Flush removal of the class so rapid clicks restart the CSS animation.
  void root.value.offsetWidth
  animating.value = true
}
function finish(event: AnimationEvent) {
  if (event.target !== root.value && props.animationTrigger === 'click') animating.value = false
}
watch([animation, () => props.animationTrigger], () => {
  replay++
  animating.value = false
})
watchEffect((cleanup) => {
  if (!root.value || !animation.value || props.animationTrigger !== 'click') return
  // A containing button/link owns keyboard activation; the icon stays decorative.
  const target = root.value.closest('button, a[href], [role="button"], [role="link"]') ?? root.value
  target.addEventListener('click', play)
  cleanup(() => target.removeEventListener('click', play))
}, { flush: 'post' })
onBeforeUnmount(() => { replay++ })
</script>
<template>
  <i ref="root" v-bind="$attrs" :class="classes" :style="style" :role="label ? 'img' : undefined"
    :aria-label="label || undefined" :aria-hidden="label ? undefined : 'true'" @animationend="finish">
    <slot><component :is="resolved" v-if="resolved" :stroke-width="strokeWidth" /></slot>
  </i>
</template>
