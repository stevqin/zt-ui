<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import { useOverlay } from '../overlay/useOverlay'
import { nextViewerTransform, normalizeViewerIndex, type ViewerTransform } from './transform'
import type { ZtImageViewerProps } from './types'
import './image.scss'

defineOptions({ name: 'ZtImageViewer' })
const props = withDefaults(defineProps<ZtImageViewerProps>(), {
  initialIndex: 0, infinite: true, zoomRate: 1.2, minScale: .2, maxScale: 7,
  hideOnClickModal: false, closeOnPressEscape: true, zIndex: 2000,
})
const emit = defineEmits<{ switch: [index:number]; close: [] }>()
const visible = ref(true)
const { panel, layer, isTop } = useOverlay({
  modelValue: visible,
  props: {
    get zIndex() { return props.zIndex },
    escClosable: false,
    focusTrap: true,
    lockScroll: true,
  },
  emit() {},
})
const index = ref(normalizeViewerIndex(props.initialIndex, props.urls.length, props.infinite))
const transform = ref<ViewerTransform>({ scale: 1, rotate: 0, x: 0, y: 0 })
const current = computed(() => props.urls[index.value])
const style = computed(() => ({ transform: `translate3d(${transform.value.x}px,${transform.value.y}px,0) scale(${transform.value.scale}) rotate(${transform.value.rotate}deg)` }))
// Viewer close is synchronous; its owner removes the viewer after this event.
function close() {
  if (!isTop.value || !visible.value) return
  visible.value = false
  emit('close')
}
function change(step: number) {
  const next = normalizeViewerIndex(index.value + step, props.urls.length, props.infinite)
  if (next === index.value) return
  index.value = next
  transform.value = { scale: 1, rotate: 0, x: 0, y: 0 }
  emit('switch', next)
}
function alter(type: 'zoom' | 'rotate', direction: 1 | -1) {
  transform.value = nextViewerTransform(transform.value, { type, direction }, { zoomRate: props.zoomRate, minScale: props.minScale, maxScale: props.maxScale })
}
function key(event: KeyboardEvent) {
  if (!isTop.value || !visible.value || event.isComposing || event.defaultPrevented) return
  if (event.key === 'Escape' && props.closeOnPressEscape) close()
  else if (event.key === 'ArrowRight') change(1)
  else if (event.key === 'ArrowLeft') change(-1)
  else if (event.key === '+') alter('zoom', 1)
  else if (event.key === '-') alter('zoom', -1)
  else if (event.key === '0') transform.value = nextViewerTransform(transform.value, { type: 'reset' })
  else return
  event.preventDefault()
  event.stopImmediatePropagation()
}
onMounted(() => document.addEventListener('keydown', key, true))
onBeforeUnmount(() => document.removeEventListener('keydown', key, true))
</script>
<template><Teleport to="body"><div class="zt-image-viewer" :style="{zIndex:layer}" @mousedown.self="hideOnClickModal&&close()"><section ref="panel" role="dialog" aria-modal="true" aria-label="图片预览" tabindex="-1"><button class="zt-image-viewer__close" type="button" aria-label="关闭预览" @click="close"><ZtIcon name="close" /></button><button class="zt-image-viewer__prev" type="button" aria-label="上一张" :disabled="!infinite&&index===0" @click="change(-1)"><ZtIcon name="chevron-left" /></button><img :src="current" alt="" :style="style"><button class="zt-image-viewer__next" type="button" aria-label="下一张" :disabled="!infinite&&index===urls.length-1" @click="change(1)"><ZtIcon name="chevron-right" /></button><div class="zt-image-viewer__toolbar"><button type="button" aria-label="缩小" @click="alter('zoom',-1)">−</button><span>{{index+1}} / {{urls.length}}</span><button type="button" aria-label="放大" @click="alter('zoom',1)">＋</button><button type="button" aria-label="向左旋转" @click="alter('rotate',-1)">↶</button><button type="button" aria-label="重置" @click="transform=nextViewerTransform(transform,{type:'reset'})">1:1</button><button type="button" aria-label="向右旋转" @click="alter('rotate',1)">↷</button></div></section></div></Teleport></template>
