<script setup lang="ts">
import { useZtConfig } from '../config-provider/context'
const { style: providerStyle } = useZtConfig()
import { useZtSize } from '../config-provider/context'
import { computed, onBeforeUnmount, reactive, ref, useId, watch } from 'vue'
import ZtButton from '../button/ZtButton.vue'
import { useOverlay } from '../overlay/useOverlay'
import type { ZtOverlayCloseReason } from '../overlay/types'
import type { ZtModalProps } from './types'
import './modal.scss'

defineOptions({ name: 'ZtModal', inheritAttrs: false })

const props = withDefaults(defineProps<ZtModalProps>(), {
  modelValue: false,
  title: '',
  width: 560,
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
  showFullscreenButton: false,
  draggable: false,
  zIndex: 1000,
})
const configSize = useZtSize(props)


const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:fullscreen': [value: boolean]
  open: []
  opened: []
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
const overlay = useOverlay({ modelValue: model, props, emit: emit as any })
const panel = overlay.panel
const titleId = useId()
const currentFullscreen = ref(props.fullscreen)
const dragging = ref(false)
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

function cssLength(value: number | string | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}

const overlayStyle = computed(() => ({
  zIndex: overlay.layer.value,
  paddingTop: props.top === undefined || currentFullscreen.value ? undefined : cssLength(props.top),
}))
const panelStyle = computed(() => ({
  width: cssLength(props.width),
  transform: !currentFullscreen.value && (position.x !== 0 || position.y !== 0)
    ? `translate3d(${position.x}px, ${position.y}px, 0)`
    : undefined,
}))
const classes = computed(() => [
  'zt-modal',
  `zt-modal--${configSize.value}`,
  props.top !== undefined && !currentFullscreen.value && 'zt-modal--top',
  currentFullscreen.value && 'zt-modal--fullscreen',
  dragging.value && 'zt-modal--dragging',
  !overlay.isTop.value && 'zt-modal--underneath',
])
const headerClasses = computed(() => [
  'zt-modal__header',
  props.draggable && !currentFullscreen.value && 'zt-modal__header--draggable',
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
    || currentFullscreen.value
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
  overlay.afterLeave()
  stopDragging()
  resetPosition()
  currentFullscreen.value = props.fullscreen
}

watch(() => props.fullscreen, value => {
  currentFullscreen.value = value
  if (value) stopDragging()
})

onBeforeUnmount(stopDragging)

defineExpose({
  open: overlay.open,
  close: overlay.requestClose,
  focus: overlay.focusPanel,
  resetPosition,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="zt-modal" appear @after-enter="overlay.afterEnter" @after-leave="handleAfterLeave">
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
          :style="panelStyle"
          role="dialog"
          :aria-modal="overlay.isTop.value ? true : undefined"
          :aria-label="ariaLabel || (!showHeader ? title || '弹窗' : undefined)"
          :aria-labelledby="!ariaLabel && showHeader ? titleId : undefined"
          :aria-busy="overlay.busy.value"
          :inert="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
          tabindex="-1"
        >
          <header v-if="showHeader" :class="headerClasses" @pointerdown="startDragging">
            <div :id="titleId" class="zt-modal__heading">
              <slot name="title" :close="overlay.requestClose">
                <h2>{{ title || '弹窗' }}</h2>
              </slot>
            </div>
            <ZtButton
              v-if="showFullscreenButton"
              class="zt-modal__fullscreen"
              circle
              :size="size"
              :disabled="overlay.busy.value"
              :aria-label="currentFullscreen ? '退出全屏' : '进入全屏'"
              :aria-pressed="currentFullscreen"
              :title="currentFullscreen ? '退出全屏' : '进入全屏'"
              @click="toggleFullscreen"
            >
              <svg v-if="!currentFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H3v5" />
                <path d="m3 3 6 6" />
                <path d="M16 3h5v5" />
                <path d="m21 3-6 6" />
                <path d="M8 21H3v-5" />
                <path d="m3 21 6-6" />
                <path d="M16 21h5v-5" />
                <path d="m21 21-6-6" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 9H4V4" />
                <path d="M4 9 10 3" />
                <path d="M15 9h5V4" />
                <path d="m20 9-6-6" />
                <path d="M9 15H4v5" />
                <path d="m4 15 6 6" />
                <path d="M15 15h5v5" />
                <path d="m20 15-6 6" />
              </svg>
            </ZtButton>
            <ZtButton
              v-if="showClose"
              class="zt-modal__close"
              circle
              :size="size"
              :disabled="overlay.busy.value"
              :aria-label="`关闭${title || '弹窗'}`"
              @click="overlay.requestClose('close')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </ZtButton>
          </header>

          <div class="zt-modal__body">
            <slot :close="overlay.requestClose" />
          </div>

          <footer v-if="showFooter || $slots.footer" class="zt-modal__footer">
            <slot name="footer" :close="overlay.requestClose" :confirm="overlay.confirm" :cancel="overlay.cancel">
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
                :disabled="confirmDisabled"
                :loading="confirmLoading"
                @click="overlay.confirm"
              >
                {{ confirmText }}
              </ZtButton>
            </slot>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
