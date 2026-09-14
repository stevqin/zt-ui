<script setup lang="ts">
import { computed, useId } from 'vue'
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
const overlay = useOverlay({ modelValue: model, props, emit: emit as any })
const panel = overlay.panel
const titleId = useId()

function cssLength(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
const panelStyle = computed(() => isVertical.value
  ? { height: cssLength(props.size) }
  : { width: cssLength(props.size) })
const classes = computed(() => [
  'zt-drawer',
  `zt-drawer--${props.placement}`,
  !overlay.isTop.value && 'zt-drawer--underneath',
])

defineExpose({
  open: overlay.open,
  close: overlay.requestClose,
  focus: overlay.focusPanel,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="zt-drawer" appear @after-enter="overlay.afterEnter" @after-leave="overlay.afterLeave">
      <div
        v-if="overlay.alive.value"
        v-show="overlay.visible.value"
        v-bind="$attrs"
        :class="classes"
        :style="{ zIndex: overlay.layer.value }"
        :aria-hidden="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
        @mousedown="overlay.maskDown"
        @click="overlay.maskClick"
      >
        <section
          ref="panel"
          class="zt-drawer__panel"
          :style="panelStyle"
          role="dialog"
          :aria-modal="overlay.isTop.value ? true : undefined"
          :aria-label="ariaLabel || (!showHeader ? title || '抽屉' : undefined)"
          :aria-labelledby="!ariaLabel && showHeader ? titleId : undefined"
          :aria-busy="overlay.busy.value"
          :inert="!overlay.isTop.value || !overlay.visible.value ? true : undefined"
          tabindex="-1"
        >
          <header v-if="showHeader" class="zt-drawer__header">
            <div :id="titleId" class="zt-drawer__heading">
              <slot name="title" :close="overlay.requestClose">
                <h2>{{ title || '抽屉' }}</h2>
              </slot>
            </div>
            <ZtButton
              v-if="showClose"
              class="zt-drawer__close"
              circle
              :disabled="overlay.busy.value"
              :aria-label="`关闭${title || '抽屉'}`"
              @click="overlay.requestClose('close')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </ZtButton>
          </header>

          <div class="zt-drawer__body">
            <slot :close="overlay.requestClose" />
          </div>

          <footer v-if="showFooter || $slots.footer" class="zt-drawer__footer">
            <slot name="footer" :close="overlay.requestClose" :confirm="overlay.confirm" :cancel="overlay.cancel">
              <ZtButton
                v-if="showCancelButton"
                class="zt-drawer__cancel"
                :disabled="overlay.busy.value"
                @click="overlay.cancel"
              >
                {{ cancelText }}
              </ZtButton>
              <ZtButton
                class="zt-drawer__confirm"
                status="primary"
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
