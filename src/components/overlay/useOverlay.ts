import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type Ref,
  type WritableComputedRef,
} from 'vue'
import type { ZtOverlayCloseReason, ZtOverlayCommonProps } from './types'
import {
  enterOverlay,
  leaveOverlay,
  lockBody,
  topOverlayId,
  unlockBody,
} from './overlayManager'

type OverlayEvent =
  | 'update:modelValue'
  | 'open'
  | 'opened'
  | 'close'
  | 'closed'
  | 'cancel'
  | 'confirm'
  | 'close-error'

export interface UseOverlayOptions {
  modelValue: Ref<boolean> | WritableComputedRef<boolean>
  props: ZtOverlayCommonProps
  emit: (event: OverlayEvent, ...args: any[]) => void
}

export function useOverlay({ modelValue, props, emit }: UseOverlayOptions) {
  const id = Symbol('zt-overlay')
  const panel = ref<HTMLElement>()
  const alive = ref(false)
  const active = ref(false)
  const closing = ref(false)
  const layer = ref(props.zIndex ?? 1000)
  const visible = computed(() => modelValue.value)
  const isTop = computed(() => topOverlayId.value === id)
  const busy = computed(() => Boolean(props.confirmLoading || closing.value))
  let previousFocus: HTMLElement | null = null
  let maskStartedOutside = false
  let lastCloseReason: ZtOverlayCloseReason = 'api'
  let activationEpoch = 0

  function focusableElements() {
    const elements = panel.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),a[href],summary,[tabindex]:not([tabindex="-1"])',
    )
    return [...(elements ?? [])].filter(element => {
      const style = getComputedStyle(element)
      return style.display !== 'none' && style.visibility !== 'hidden' && !element.closest('[inert]')
    })
  }

  function focusPanel() {
    const elements = focusableElements()
    const preferred = panel.value?.querySelector<HTMLElement>('[autofocus]')
    if (preferred && elements.includes(preferred)) preferred.focus({ preventScroll: true })
    else (elements[0] ?? panel.value)?.focus({ preventScroll: true })
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!active.value || !isTop.value) return

    if (event.key === 'Escape' && !event.isComposing) {
      if (props.escClosable !== false) {
        event.preventDefault()
        event.stopImmediatePropagation()
        void requestClose('escape')
      }
      return
    }

    if (event.key !== 'Tab' || !props.focusTrap) return
    const elements = focusableElements()
    const first = elements[0]
    const last = elements.at(-1)
    const current = document.activeElement

    if (!first || !last) {
      event.preventDefault()
      panel.value?.focus()
    } else if (event.shiftKey && (current === first || !elements.includes(current as HTMLElement))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (current === last || !elements.includes(current as HTMLElement))) {
      event.preventDefault()
      first.focus()
    }
  }

  function handleFocusIn(event: FocusEvent) {
    if (active.value && isTop.value && props.focusTrap && !panel.value?.contains(event.target as Node)) {
      focusPanel()
    }
  }

  async function activate() {
    if (active.value) return
    const epoch = ++activationEpoch
    active.value = true
    alive.value = true
    previousFocus = document.activeElement as HTMLElement | null
    layer.value = enterOverlay(id, props.zIndex ?? 1000)
    if (props.lockScroll !== false) lockBody(id)
    document.addEventListener('keydown', handleKeydown, true)
    document.addEventListener('focusin', handleFocusIn, true)
    emit('open')
    await nextTick()
    if (epoch === activationEpoch && visible.value && isTop.value && props.autoFocus !== false) focusPanel()
  }

  function release() {
    if (!active.value) return
    const restoreTarget = previousFocus
    active.value = false
    activationEpoch++
    closing.value = false
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('focusin', handleFocusIn, true)
    leaveOverlay(id)
    unlockBody(id)
    previousFocus = null
    void nextTick(() => {
      if (!active.value && restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true })
    })
  }

  async function requestClose(reason: ZtOverlayCloseReason = 'api') {
    if (!visible.value || !isTop.value || closing.value) return false
    closing.value = true
    try {
      const allowed = await props.beforeClose?.(reason)
      if (allowed === false) {
        closing.value = false
        return false
      }
      lastCloseReason = reason
      modelValue.value = false
      emit('close', reason)
      if (reason === 'cancel') emit('cancel')
      return true
    } catch (error) {
      closing.value = false
      emit('close-error', error)
      return false
    }
  }

  function confirm() {
    if (!busy.value && !props.confirmDisabled) emit('confirm')
  }

  function cancel() {
    return requestClose('cancel')
  }

  function maskDown(event: MouseEvent) {
    maskStartedOutside = event.target === event.currentTarget
  }

  function maskClick(event: MouseEvent) {
    const isTrueMaskClick = maskStartedOutside && event.target === event.currentTarget
    maskStartedOutside = false
    if (isTrueMaskClick && props.maskClosable && isTop.value) void requestClose('mask')
  }

  function afterEnter() {
    if (!visible.value) return
    if (isTop.value && props.autoFocus !== false) focusPanel()
    emit('opened')
  }

  function afterLeave() {
    if (visible.value) return
    release()
    if (props.destroyOnClose) alive.value = false
    emit('closed', lastCloseReason)
    lastCloseReason = 'api'
  }

  watch(visible, value => {
    if (value) void activate()
    else if (active.value && !closing.value) lastCloseReason = 'api'
  }, { immediate: true, flush: 'sync' })

  watch(() => props.lockScroll, value => {
    if (!active.value) return
    if (value === false) unlockBody(id)
    else lockBody(id)
  })

  onBeforeUnmount(release)

  return {
    alive,
    busy,
    visible,
    layer,
    isTop,
    panel,
    requestClose,
    confirm,
    cancel,
    maskDown,
    maskClick,
    afterEnter,
    afterLeave,
    focusPanel,
    open: () => { modelValue.value = true },
  }
}
