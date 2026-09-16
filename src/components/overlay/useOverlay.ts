import {
  computed,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  watch,
  type Ref,
  type WritableComputedRef,
} from 'vue'
import type { ZtOverlayCloseReason, ZtOverlayCommonProps } from './types'
import {
  captureOverlayFocusFallback,
  enterOverlay,
  leaveOverlay,
  lockBody,
  topOverlayId,
  unlockBody,
} from './overlayManager'
import { overlayContextKey, type OverlayBranch } from './context'

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
  let previousFocusFallback: (() => void) | undefined
  let maskStartedOutside = false
  let lastCloseReason: ZtOverlayCloseReason = 'api'
  let activationEpoch = 0
  const branches = new Set<OverlayBranch>()

  provide(overlayContextKey, {
    interactive: computed(() => active.value && visible.value && isTop.value),
    registerBranch(branch) {
      branches.add(branch)
      return () => branches.delete(branch)
    },
  })

  function captureFocusFallback(target: HTMLElement | null) {
    const branch = branchContaining(target)
    if (!branch) return undefined
    return () => {
      if (active.value && visible.value && isTop.value && branch.trigger.value?.isConnected) branch.focus()
    }
  }

  function branchContaining(target: EventTarget | null) {
    if (!(target instanceof Node)) return undefined
    return [...branches].reverse().find(branch => branch.visible.value
      && (branch.trigger.value?.contains(target) || branch.popup.value?.contains(target)))
  }

  function focusableElements() {
    const elements = panel.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),a[href],summary,[tabindex]:not([tabindex="-1"])',
    )
    return [...(elements ?? [])].filter(element => {
      const style = getComputedStyle(element)
      return element.tabIndex >= 0 && style.display !== 'none' && style.visibility !== 'hidden'
        && !element.closest('[inert]')
    })
  }

  function focusPanel() {
    const elements = focusableElements()
    const preferred = panel.value?.querySelector<HTMLElement>('[autofocus]')
    if (preferred && elements.includes(preferred)) preferred.focus({ preventScroll: true })
    else (elements[0] ?? panel.value)?.focus({ preventScroll: true })
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!active.value || !isTop.value || event.isComposing || event.defaultPrevented) return

    const branch = branchContaining(event.target)
    if (event.key === 'Escape' && branch) {
      event.preventDefault()
      event.stopImmediatePropagation()
      // Move focus before removing a teleported popup so it never blurs to body.
      branch.focus()
      branch.close()
      return
    }

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

    if (branch?.popup.value?.contains(current)) {
      // Tab leaves a popup at its trigger's logical position in the dialog.
      const triggerIndices = elements.flatMap((element, index) => branch.trigger.value?.contains(element) ? [index] : [])
      const triggerIndex = (event.shiftKey ? triggerIndices[0] : triggerIndices.at(-1)) ?? -1
      const nextIndex = (triggerIndex + (event.shiftKey ? -1 : 1) + elements.length) % elements.length
      event.preventDefault()
      const next = elements[nextIndex] ?? panel.value
      next?.focus()
      branch.close()
      return
    }

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
    if (active.value && isTop.value && props.focusTrap
      && !panel.value?.contains(event.target as Node) && !branchContaining(event.target)) {
      focusPanel()
    }
  }

  async function activate() {
    if (active.value) return
    const epoch = ++activationEpoch
    active.value = true
    alive.value = true
    previousFocus = document.activeElement as HTMLElement | null
    // Capture before entering the stack closes the parent's transient popup.
    previousFocusFallback = captureOverlayFocusFallback(previousFocus)
    layer.value = enterOverlay(id, props.zIndex ?? 1000, captureFocusFallback)
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
    const restoreFallback = previousFocusFallback
    active.value = false
    activationEpoch++
    closing.value = false
    document.removeEventListener('keydown', handleKeydown, true)
    document.removeEventListener('focusin', handleFocusIn, true)
    leaveOverlay(id)
    unlockBody(id)
    previousFocus = null
    previousFocusFallback = undefined
    void nextTick(() => {
      if (active.value) return
      if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true })
      else restoreFallback?.()
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
    if (isTop.value && props.autoFocus !== false
      && !panel.value?.contains(document.activeElement) && !branchContaining(document.activeElement)) focusPanel()
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
