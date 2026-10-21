<script setup lang="ts">
import { provideZtSizeScope, useZtConfig, useZtSize } from '../config-provider/context'
const { style: providerStyle } = useZtConfig()
import { computed, nextTick, onBeforeUnmount, reactive, ref, useId, watch } from 'vue'
import ZtButton from '../button/ZtButton.vue'
import { animateFullscreenBounds } from './fullscreenMotion'
import { useOverlay } from '../overlay/useOverlay'
import { useOverlayBreakpoint } from '../overlay/useOverlayBreakpoint'
import type { ZtOverlayCloseReason } from '../overlay/types'
import type { ZtModalProps } from './types'
import './modal.scss'

defineOptions({ name: 'ZtModal', inheritAttrs: false })

const props = withDefaults(defineProps<ZtModalProps>(), {
  modelValue: false,
  title: '',
  width: 560,
  placement: 'center',
  fullscreenBelow: 0,
  bodyScroll: true,
  loading: false,
  loadingText: '正在加载…',
  showHeader: true,
  showClose: true,
  showFooter: false,
  showCancelButton: true,
  confirmText: '确定',
  cancelText: '取消',
  confirmLoading: false,
  confirmDisabled: false,
  maskClosable: false,
  escClosable: true,
  lockScroll: true,
  destroyOnClose: false,
  autoFocus: true,
  focusTrap: true,
  fullscreen: false,
  showFullscreenButton: undefined,
  draggable: false,
  zIndex: 1000,
})
const configSize = useZtSize(props)
provideZtSizeScope(configSize)


const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:fullscreen': [value: boolean]
  open: []
  opened: []
  show: []
  hide: []
  close: [reason: ZtOverlayCloseReason]
  closed: [reason: ZtOverlayCloseReason]
  cancel: []
  confirm: []
  'fullscreen-change': [value: boolean]
  'close-error': [error: unknown]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
// Keep Escape/mask/API close behind the same confirmLoading gate as Drawer.
const overlayProps = new Proxy(props, {
  get(target, key) {
    if (key === 'confirmLoading') return target.loading || target.confirmLoading
    if (key === 'beforeClose') return (reason: ZtOverlayCloseReason) => {
      if (target.loading || target.confirmLoading) return false
      return target.beforeClose?.(reason)
    }
    return Reflect.get(target, key)
  },
})
const overlay = useOverlay({ modelValue: model, props: overlayProps, emit: (event, ...args) => {
  ;(emit as (...args: any[]) => void)(event, ...args)
  if (event === 'opened') emit('show')
  if (event === 'closed') emit('hide')
} })
const panel = overlay.panel
const titleId = useId()
const currentFullscreen = ref(props.fullscreen)
const narrow = useOverlayBreakpoint(() => props.fullscreenBelow, overlay.visible)
const expanded = computed(() => currentFullscreen.value || narrow.value)
const showZoomButton = computed(() => (props.showFullscreenButton ?? props.showZoom ?? false) && !narrow.value)
const scope = { close: overlay.requestClose, confirm: overlay.confirm, cancel: overlay.cancel, toggleFullscreen }
const dragging = ref(false)
const resizing = ref(false)
let fullscreenAnimation: Animation | null = null
let fullscreenCleanup: (() => void) | null = null
let fullscreenMotionEpoch = 0
const position = reactive({ x: 0, y: 0 })
let pointerId: number | null = null
let startPointerX = 0
let startPointerY = 0
let startPositionX = 0
let startPositionY = 0
let minPositionX = 0
let maxPositionX = 0
let minPositionY = 0
let maxPositionY = 0

function guardLoading(event: Event) {
  if (!props.loading) return
  if (event.type === 'keydown') { event.preventDefault(); event.stopPropagation() }
  if (event.target !== panel.value) panel.value?.focus({ preventScroll: true })
}
watch(() => props.loading, loading => {
  if (loading && overlay.visible.value && overlay.isTop.value) panel.value?.focus({ preventScroll: true })
}, { flush: 'post' })

function cssLength(value: number | string | undefined) {
  if (typeof value === 'number') return `${value}px`
  if (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim())) return `${Number(value)}px`
  return value
}

const overlayStyle = computed(() => ({
  zIndex: overlay.layer.value,
  paddingTop: props.top === undefined || expanded.value ? undefined : cssLength(props.top),
}))
const panelStyle = computed(() => ({
  width: expanded.value ? '100%' : cssLength(props.width),
  height: expanded.value ? '100%' : cssLength(props.height),
  maxHeight: expanded.value ? '100%' : cssLength(props.maxHeight),
  transform: !expanded.value && (position.x !== 0 || position.y !== 0)
    ? `translate3d(${position.x}px, ${position.y}px, 0)`
    : undefined,
}))
const classes = computed(() => [
  'zt-modal',
  `zt-modal--${configSize.value}`,
  props.top !== undefined && !expanded.value && 'zt-modal--top',
  expanded.value && 'zt-modal--fullscreen',
  props.placement === 'bottom' && !expanded.value && 'zt-modal--bottom',
  dragging.value && 'zt-modal--dragging',
  resizing.value && 'zt-modal--resizing',
  !overlay.isTop.value && 'zt-modal--underneath',
  expanded.value && props.classNames?.fullscreen,
  props.placement === 'bottom' && !expanded.value && props.classNames?.bottom,
  props.top !== undefined && !expanded.value && props.classNames?.top,
  !overlay.isTop.value && props.classNames?.underneath,
])
const headerClasses = computed(() => [
  'zt-modal__header',
  props.draggable && !expanded.value && 'zt-modal__header--draggable',
])

function toggleFullscreen() {
  if (overlay.busy.value) return
  currentFullscreen.value = !currentFullscreen.value
  emit('update:fullscreen', currentFullscreen.value)
  emit('fullscreen-change', currentFullscreen.value)
}

function resetPosition() {
  position.x = 0
  position.y = 0
}

function stopDragging() {
  if (pointerId === null) return
  pointerId = null
  dragging.value = false
  document.removeEventListener('pointermove', moveModal)
  document.removeEventListener('pointerup', stopDragging)
  document.removeEventListener('pointercancel', stopDragging)
}

function moveModal(event: PointerEvent) {
  if (pointerId === null || event.pointerId !== pointerId) return
  event.preventDefault()
  const nextX = startPositionX + event.clientX - startPointerX
  const nextY = startPositionY + event.clientY - startPointerY
  position.x = Math.min(maxPositionX, Math.max(minPositionX, nextX))
  position.y = Math.min(maxPositionY, Math.max(minPositionY, nextY))
}

function startDragging(event: PointerEvent) {
  const target = event.target as Element | null
  if (
    !props.draggable
    || expanded.value
    || resizing.value
    || event.button !== 0
    || target?.closest('button, a, input, select, textarea, [contenteditable], [data-no-drag]')
    || !panel.value
  ) return

  const rect = panel.value.getBoundingClientRect()
  pointerId = event.pointerId
  startPointerX = event.clientX
  startPointerY = event.clientY
  startPositionX = position.x
  startPositionY = position.y
  minPositionX = position.x - rect.left
  maxPositionX = position.x + window.innerWidth - rect.right
  minPositionY = position.y - rect.top
  maxPositionY = position.y + window.innerHeight - rect.bottom
  dragging.value = true
  event.preventDefault()
  document.addEventListener('pointermove', moveModal, { passive: false })
  document.addEventListener('pointerup', stopDragging)
  document.addEventListener('pointercancel', stopDragging)
}

function handleAfterLeave() {
  if (overlay.visible.value) return
  overlay.afterLeave()
  stopDragging()
  resetPosition()
  currentFullscreen.value = props.fullscreen
}

function handleAfterEnter() {
  overlay.afterEnter()
  if (!fullscreenAnimation) resizing.value = false
}

watch(() => props.fullscreen, value => {
  currentFullscreen.value = value
  if (value) stopDragging()
})

function releaseFullscreenMotion() {
  const animation = fullscreenAnimation
  fullscreenAnimation = null
  if (animation) {
    animation.onfinish = null
    animation.oncancel = null
  }
  fullscreenCleanup?.()
  fullscreenCleanup = null
  animation?.cancel()
}

function stopFullscreenMotion() {
  fullscreenMotionEpoch++
  releaseFullscreenMotion()
  resizing.value = false
}

// Capture the visible bounds before Vue changes fullscreen layout, including
// an interrupted transition. Lay out the content once at its destination size.
watch(expanded, async () => {
  const epoch = ++fullscreenMotionEpoch
  const element = panel.value
  const before = element?.getBoundingClientRect()
  releaseFullscreenMotion()
  if (
    !element || !overlay.visible.value || !before?.width || !before.height
    || typeof element.animate !== 'function'
    || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    resizing.value = false
    return
  }
  stopDragging()
  resizing.value = true
  await nextTick()
  if (epoch !== fullscreenMotionEpoch || panel.value !== element || !overlay.visible.value) return
  const after = element.getBoundingClientRect()
  if (!after.width || !after.height) {
    resizing.value = false
    return
  }
  const { animation, cleanup } = animateFullscreenBounds(element, before, after)
  fullscreenAnimation = animation
  fullscreenCleanup = cleanup
  const finish = () => {
    if (epoch !== fullscreenMotionEpoch) return
    releaseFullscreenMotion()
    // If fullscreen was toggled during entry, don't restart the jelly animation.
    resizing.value = element.parentElement?.classList.contains('zt-modal-enter-active') ?? false
  }
  animation.onfinish = finish
  animation.oncancel = finish
})

watch(overlay.visible, value => {
  if (!value) stopFullscreenMotion()
}, { flush: 'sync' })

onBeforeUnmount(stopDragging)
onBeforeUnmount(stopFullscreenMotion)

defineExpose({
  open: overlay.open,
  close: overlay.requestClose,
  focus: overlay.focusPanel,
  resetPosition,
  toggleFullscreen,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="zt-modal" appear @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
      <div
        v-if="overlay.alive.value"
        v-show="overlay.visible.value"
        v-bind="$attrs"
        :class="classes"
        :style="[providerStyle, overlayStyle]"
        :aria-hidden="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
        @mousedown="overlay.maskDown"
        @click="overlay.maskClick"
      >
        <section
          ref="panel"
          class="zt-modal__panel"
          :class="classNames?.panel"
          :style="panelStyle"
          role="dialog"
          :aria-modal="overlay.isTop.value ? true : undefined"
          :aria-label="ariaLabel || (!showHeader ? title || '弹窗' : undefined)"
          :aria-labelledby="!ariaLabel && showHeader ? titleId : undefined"
          :aria-busy="overlay.busy.value"
          :inert="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
          tabindex="-1"
          @keydown.capture="guardLoading"
          @focusin.capture="guardLoading"
        >
          <header v-if="showHeader" :class="[headerClasses, classNames?.header]" @pointerdown="startDragging">
            <div :id="titleId" class="zt-modal__heading" :class="classNames?.heading">
              <slot name="title" :close="overlay.requestClose">
                <h2>{{ title || '弹窗' }}</h2>
              </slot>
              <p v-if="subtitle" class="zt-modal__subtitle">{{ subtitle }}</p>
            </div>
            <div class="zt-modal__tools" :class="classNames?.tools">
            <slot name="header-actions" v-bind="scope" />
            <ZtButton
              v-if="showZoomButton"
              class="zt-modal__fullscreen"
              circle
              :size="size"
              :disabled="overlay.busy.value"
              :aria-label="currentFullscreen ? '退出全屏' : '进入全屏'"
              :aria-pressed="currentFullscreen"
              :title="currentFullscreen ? '退出全屏' : '进入全屏'"
              @click="toggleFullscreen"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <template v-if="!currentFullscreen">
                  <path d="M9 9 3 3m0 5V3h5" />
                  <path d="m15 9 6-6m-5 0h5v5" />
                  <path d="m9 15-6 6m0-5v5h5" />
                  <path d="m15 15 6 6m-5 0h5v-5" />
                </template>
                <template v-else>
                  <path d="m3 3 6 6M4 9h5V4" />
                  <path d="m21 3-6 6m0-5v5h5" />
                  <path d="m3 21 6-6m-5 0h5v5" />
                  <path d="m21 21-6-6m0 5v-5h5" />
                </template>
              </svg>
            </ZtButton>
            <ZtButton
              v-if="showClose"
              class="zt-modal__close"
              :class="classNames?.close"
              circle
              :size="size"
              :disabled="overlay.busy.value"
              :aria-label="closeLabel || `关闭${title || '弹窗'}`"
              @click="overlay.requestClose('close')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </ZtButton>
            </div>
          </header>

          <slot v-if="$slots.content" name="content" v-bind="scope" />
          <div v-else class="zt-modal__body" :class="[classNames?.body, { 'zt-modal__body--custom-scroll': !bodyScroll }]"
            :style="{ padding: cssLength(bodyPadding) }" :inert="loading ? true : undefined">
            <slot v-bind="scope" />
          </div>

          <footer v-if="showFooter || $slots.footer" class="zt-modal__footer" :class="classNames?.footer">
            <slot name="footer" v-bind="scope">
              <ZtButton
                v-if="showCancelButton"
                class="zt-modal__cancel"
                :size="size"
                :disabled="overlay.busy.value"
                @click="overlay.cancel"
              >
                {{ cancelText }}
              </ZtButton>
              <ZtButton
                class="zt-modal__confirm"
                status="primary"
                :size="size"
                :disabled="overlay.busy.value || confirmDisabled"
                :loading="confirmLoading"
                @click="overlay.confirm"
              >
                {{ confirmText }}
              </ZtButton>
            </slot>
          </footer>
          <div v-if="loading" class="zt-modal__loading" role="status" aria-live="polite">
            <span class="zt-modal__spinner" aria-hidden="true" />{{ loadingText }}
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
