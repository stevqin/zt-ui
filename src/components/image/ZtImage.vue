<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import ZtImageViewer from './ZtImageViewer.vue'
import type { ZtImageProps } from './types'
import './image.scss'

defineOptions({ name: 'ZtImage', inheritAttrs: false })

const props = withDefaults(defineProps<ZtImageProps>(), {
  fit: 'fill',
  position: 'center',
  lazy: false,
  showPreview: true,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  closeOnPressEscape: true,
  zIndex: 2000,
})
const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  show: []
  switch: [index: number]
  close: []
}>()

const loading = ref(true)
const failed = ref(false)
const open = ref(false)
const root = ref<HTMLElement>()
const previewUrls = computed(() => props.previewSrcList === undefined ? [props.src] : props.previewSrcList)
const canPreview = computed(() => props.showPreview && previewUrls.value.length > 0)

watch(() => props.src, () => {
  loading.value = true
  failed.value = false
})

function show() {
  if (!canPreview.value) return
  open.value = true
  emit('show')
}

function close() {
  open.value = false
  emit('close')
  void nextTick(() => root.value?.focus())
}
</script>

<template>
  <div
    ref="root"
    class="zt-image"
    :class="{ 'is-preview': canPreview }"
    :role="canPreview ? 'button' : undefined"
    :tabindex="canPreview ? 0 : undefined"
    @click="show"
    @keydown.enter.prevent="show"
    @keydown.space.prevent="show"
  >
    <img
      v-bind="$attrs"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :style="{ objectFit: fit, objectPosition: position }"
      @load="loading = false; failed = false; emit('load', $event)"
      @error="loading = false; failed = true; emit('error', $event)"
    >
    <div v-if="loading" class="zt-image__state">
      <slot name="placeholder"><ZtIcon name="image" /></slot>
    </div>
    <div v-else-if="failed" class="zt-image__state">
      <slot name="error"><ZtIcon name="warning" /></slot>
    </div>
    <div v-if="canPreview" class="zt-image__preview-mask"><ZtIcon name="visibility" /></div>
    <ZtImageViewer
      v-if="open"
      :urls="previewUrls"
      :initial-index="initialIndex"
      :infinite="infinite"
      :hide-on-click-modal="hideOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :z-index="zIndex"
      @switch="emit('switch', $event)"
      @close="close"
    />
  </div>
</template>
