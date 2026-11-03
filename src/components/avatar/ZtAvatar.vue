<script setup lang="ts">
import { computed, inject, ref, useSlots, watch } from 'vue'
import { useZtConfig } from '../config-provider/context'
import ZtIcon from '../icon/ZtIcon.vue'
import { avatarGroupKey, avatarSizes, avatarSizeStyle } from './context'
import type { ZtAvatarProps } from './types'
import './avatar.scss'

defineOptions({ name: 'ZtAvatar' })
const props = withDefaults(defineProps<ZtAvatarProps>(), { fit: 'cover', status: 'default' })
const emit = defineEmits<{ load: [event: Event]; error: [event: Event] }>()
const failed = ref(false), slots = useSlots(), config = useZtConfig(), group = inject(avatarGroupKey, undefined)
watch(() => [props.src, props.srcSet], () => { failed.value = false })
const size = computed(() => props.size ?? group?.size.value ?? config.size.value)
const shape = computed(() => props.shape ?? group?.shape.value ?? 'circle')
const preset = computed(() => avatarSizes.includes(size.value as typeof avatarSizes[number]) ? size.value : undefined)
const custom = computed(() => avatarSizeStyle(size.value))
const initial = computed(() => {
  const text = props.alt?.trim() || ''
  const Segmenter = (Intl as typeof Intl & { Segmenter?: new (locale: undefined, options: { granularity: 'grapheme' }) => { segment(value: string): Iterable<{ segment: string }> } }).Segmenter
  return Segmenter
    ? new Segmenter(undefined, { granularity: 'grapheme' }).segment(text)[Symbol.iterator]().next().value?.segment
    : Array.from(text)[0]
})
</script>
<template>
  <span class="zt-avatar" :class="[`zt-avatar--${shape}`, `zt-avatar--${status}`, preset && `zt-avatar--${preset}`]" :style="custom ? { '--zt-avatar-size': custom } : undefined" :aria-label="alt || undefined">
    <img v-if="(src || srcSet) && !failed" :src="src" :srcset="srcSet" :alt="alt || ''" :style="{ objectFit: fit }" @load="emit('load', $event)" @error="failed = true; emit('error', $event)">
    <slot v-else-if="slots.default" />
    <ZtIcon v-else-if="icon" :name="typeof icon === 'string' ? icon : undefined" :component="typeof icon === 'string' ? undefined : icon" />
    <span v-else-if="initial" class="zt-avatar__initial">{{ initial }}</span>
    <ZtIcon v-else name="user" />
  </span>
</template>
