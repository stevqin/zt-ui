<script setup lang="ts">
import { useZtConfig } from '../config-provider/context'
const { style: providerStyle } = useZtConfig()
import { computed, useId, watch, ref, onBeforeUnmount } from 'vue'
import ZtButton from '../button/ZtButton.vue'
import { useOverlay } from '../overlay/useOverlay'
import type { ZtOverlayCloseReason } from '../overlay/types'
import type { ZtDrawerProps } from './types'
import './drawer.scss'

defineOptions({ name: 'ZtDrawer', inheritAttrs: false })

const props = withDefaults(defineProps<ZtDrawerProps>(), {
  modelValue: false,
  title: '',
  placement: 'right',
  size: 420,
  fullscreenBelow: 0,
  bodyScroll: true,
  bodyPadding: 22,
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
  zIndex: 1000,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  show: []
  hide: []
  close: [reason: ZtOverlayCloseReason]
  closed: [reason: ZtOverlayCloseReason]
  cancel: []
  confirm: []
  'close-error': [error: unknown]
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
// Keep all close paths (mask, Escape, slot/API, cancel) behind the same gate.
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
const overlay = useOverlay({
  modelValue: model,
  props: overlayProps,
  emit: (event, ...args) => {
    ;(emit as (...args: any[]) => void)(event, ...args)
    if (event === 'opened') emit('show')
    if (event === 'closed') emit('hide')
  },
})
const scope = { close: overlay.requestClose, confirm: overlay.confirm, cancel: overlay.cancel }
const panel = overlay.panel
const titleId = useId()
let transitionPhase: 'entering' | 'open' | 'leaving' | 'closed' = 'closed'
watch(overlay.visible, visible => { transitionPhase = visible ? 'entering' : 'leaving' }, { immediate: true, flush: 'sync' })
function afterEnter() {
  if (!overlay.visible.value || transitionPhase !== 'entering') return
  transitionPhase = 'open'
  overlay.afterEnter()
}
function afterLeave() {
  if (overlay.visible.value || transitionPhase !== 'leaving') return
  transitionPhase = 'closed'
  overlay.afterLeave()
}
function guardLoading(event: Event) {
  if (!props.loading) return
  if (event.type === 'keydown') {
    event.preventDefault()
    event.stopPropagation()
  }
  if (event.target !== panel.value) panel.value?.focus({ preventScroll: true })
}
watch(() => props.loading, loading => {
  if (loading && overlay.visible.value && overlay.isTop.value) panel.value?.focus({ preventScroll: true })
}, { flush: 'post' })

function cssLength(value: number | string) {
  return typeof value === 'number' || /^\d+(?:\.\d+)?$/.test(value.trim()) ? `${Number(value)}px` : value
}

const narrow = ref(false)
let media: MediaQueryList | undefined
const updateNarrow = () => { narrow.value = media?.matches ?? false }
function removeMedia() {
  if (media?.removeEventListener) media.removeEventListener('change', updateNarrow)
  else media?.removeListener(updateNarrow)
  media = undefined
}
watch(() => props.fullscreenBelow, value => {
  removeMedia()
  if (value > 0 && typeof window !== 'undefined' && window.matchMedia) {
    media = window.matchMedia(`(max-width: ${value - 0.02}px)`)
    if (media.addEventListener) media.addEventListener('change', updateNarrow)
    else media.addListener(updateNarrow)
  }
  updateNarrow()
}, { immediate: true })
onBeforeUnmount(removeMedia)

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const panelStyle = computed(() => isVertical.value
  ? { height: cssLength(props.size) }
  : { width: cssLength(props.width ?? props.size) })
const classes = computed(() => [
  'zt-drawer-surface',
  `zt-drawer-surface--${props.placement}`,
  narrow.value && !isVertical.value && 'zt-drawer-surface--narrow',
  !overlay.isTop.value && 'zt-drawer-surface--underneath',
])

defineExpose({
  open: overlay.open,
  close: overlay.requestClose,
  focus: overlay.focusPanel,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="zt-drawer-surface" appear @after-enter="afterEnter" @after-leave="afterLeave">
      <div
        v-if="overlay.alive.value"
        v-show="overlay.visible.value"
        v-bind="$attrs"
        :class="classes"
        :style="[providerStyle, { zIndex: overlay.layer.value }]"
        :aria-hidden="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
        @mousedown="overlay.maskDown"
        @click="overlay.maskClick"
      >
        <section
          ref="panel"
          class="zt-drawer-surface__panel"
          :style="panelStyle"
          role="dialog"
          :aria-modal="overlay.isTop.value ? true : undefined"
          :aria-label="ariaLabel || (!showHeader ? title || '抽屉' : undefined)"
          :aria-labelledby="!ariaLabel && showHeader ? titleId : undefined"
          :aria-busy="overlay.busy.value"
          :inert="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
          tabindex="-1"
          @keydown.capture="guardLoading"
          @focusin.capture="guardLoading"
        >
          <header v-if="showHeader" class="zt-drawer-surface__header">
            <div :id="titleId" class="zt-drawer-surface__heading">
              <slot name="title" v-bind="scope">
                <h2>{{ title || '抽屉' }}</h2>
              </slot>
              <p v-if="subtitle" class="zt-drawer-surface__subtitle">{{ subtitle }}</p>
            </div>
            <slot name="header-actions" v-bind="scope" />
            <ZtButton
              v-if="showClose"
              class="zt-drawer-surface__close"
              circle
              :disabled="overlay.busy.value"
              :aria-label="closeLabel || `关闭${title || '抽屉'}`"
              @click="overlay.requestClose('close')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </ZtButton>
          </header>

          <slot v-if="$slots.content" name="content" v-bind="scope" />
          <div v-else class="zt-drawer-surface__body"
            :class="{ 'zt-drawer-surface__body--custom-scroll': !bodyScroll }"
            :style="{ padding: cssLength(bodyPadding) }"
            :inert="loading ? true : undefined"
          >
            <slot v-bind="scope" />
          </div>

          <footer v-if="showFooter || $slots.footer" class="zt-drawer-surface__footer">
            <slot name="footer" v-bind="scope">
              <ZtButton
                v-if="showCancelButton"
                class="zt-drawer-surface__cancel"
                :disabled="overlay.busy.value"
                @click="overlay.cancel"
              >
                {{ cancelText }}
              </ZtButton>
              <ZtButton
                class="zt-drawer-surface__confirm"
                status="primary"
                :disabled="overlay.busy.value || confirmDisabled"
                :loading="confirmLoading"
                @click="overlay.confirm"
              >
                {{ confirmText }}
              </ZtButton>
            </slot>
          </footer>
          <div v-if="loading" class="zt-drawer-surface__loading" role="status" aria-live="polite">
            <span class="zt-drawer-surface__spinner" aria-hidden="true" />{{ loadingText }}
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
