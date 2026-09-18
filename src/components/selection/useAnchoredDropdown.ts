import {
  computed,
  inject,
  onBeforeUnmount,
  ref,
  watch,
  type ComputedRef,
  type CSSProperties,
  type Ref,
} from 'vue'
import {
  overlayContextKey,
  type OverlayBranch,
  type OverlayContext,
} from '../overlay/context'

export interface UseAnchoredDropdownOptions {
  visible: Ref<boolean>
  trigger: Ref<HTMLElement | undefined>
  popup: Ref<HTMLElement | undefined>
  minWidth?: Ref<number | undefined>
  close: () => void
  focus: () => void
}

export interface AnchoredDropdown {
  popupStyle: ComputedRef<CSSProperties>
  placement: Ref<'top' | 'bottom'>
  overlayContext: OverlayContext
  childBranches: Set<OverlayBranch>
  updatePosition: () => void
  containsTarget: (target: Node) => boolean
  dispose: () => void
}

interface PopupGeometry {
  top: number
  left: number
  width: number
  maxHeight: number
}

const VIEWPORT_GUTTER = 8

export function useAnchoredDropdown(
  options: UseAnchoredDropdownOptions,
): AnchoredDropdown {
  const parentOverlay = inject(overlayContextKey, undefined)
  const placement = ref<'top' | 'bottom'>('bottom')
  const geometry = ref<PopupGeometry>()
  const childBranches = new Set<OverlayBranch>()
  const childRegistrations = new Set<() => void>()
  let resizeObserver: ResizeObserver | undefined
  let listening = false
  let disposed = false

  const popupStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    top: geometry.value ? `${geometry.value.top}px` : undefined,
    left: geometry.value ? `${geometry.value.left}px` : undefined,
    width: geometry.value ? `${geometry.value.width}px` : undefined,
    maxHeight: geometry.value ? `${geometry.value.maxHeight}px` : undefined,
  }))

  function registerBranch(branch: OverlayBranch) {
    if (disposed) return () => undefined
    childBranches.add(branch)
    const unregisterParent = parentOverlay?.registerBranch(branch)
    let registered = true
    const unregister = () => {
      if (!registered) return
      registered = false
      childBranches.delete(branch)
      unregisterParent?.()
      childRegistrations.delete(unregister)
    }
    childRegistrations.add(unregister)
    return unregister
  }

  const overlayContext: OverlayContext = {
    interactive: computed(() =>
      options.visible.value && parentOverlay?.interactive.value !== false,
    ),
    registerBranch,
  }

  function containsTarget(target: Node) {
    if (
      options.trigger.value?.contains(target) ||
      options.popup.value?.contains(target)
    ) return true
    return [...childBranches].some(branch =>
      branch.visible.value &&
      (branch.trigger.value?.contains(target) || branch.popup.value?.contains(target)),
    )
  }

  function closeChildBranches() {
    for (const branch of [...childBranches].reverse()) {
      if (branch.visible.value) branch.close()
    }
  }

  function close() {
    closeChildBranches()
    options.close()
  }

  function updatePosition() {
    const trigger = options.trigger.value
    const popup = options.popup.value
    if (!trigger || !popup) return
    const triggerRect = trigger.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const maximumWidth = Math.max(0, viewportWidth - VIEWPORT_GUTTER * 2)
    const width = Math.min(
      maximumWidth,
      Math.max(triggerRect.width, options.minWidth?.value ?? 0),
    )
    const viewportTop = VIEWPORT_GUTTER
    const viewportBottom = Math.max(
      viewportTop,
      viewportHeight - VIEWPORT_GUTTER,
    )
    const triggerTop = Math.max(
      viewportTop,
      Math.min(triggerRect.top, viewportBottom),
    )
    const triggerBottom = Math.max(
      viewportTop,
      Math.min(triggerRect.bottom, viewportBottom),
    )
    const spaceBelow = viewportBottom - triggerBottom
    const spaceAbove = triggerTop - viewportTop
    const opensAbove = spaceBelow < popupRect.height && spaceAbove > spaceBelow
    const availableHeight = opensAbove ? spaceAbove : spaceBelow
    const visibleHeight = Math.min(popupRect.height, availableHeight)
    const furthestLeft = Math.max(
      VIEWPORT_GUTTER,
      viewportWidth - width - VIEWPORT_GUTTER,
    )

    placement.value = opensAbove ? 'top' : 'bottom'
    geometry.value = {
      top: opensAbove
        ? triggerTop - visibleHeight
        : triggerBottom,
      left: Math.max(
        VIEWPORT_GUTTER,
        Math.min(triggerRect.left, furthestLeft),
      ),
      width,
      maxHeight: availableHeight,
    }
  }

  function stopResizeObserver() {
    resizeObserver?.disconnect()
    resizeObserver = undefined
  }

  function startResizeObserver() {
    stopResizeObserver()
    if (typeof ResizeObserver === 'undefined' || !options.popup.value) return
    resizeObserver = new ResizeObserver(updatePosition)
    if (options.trigger.value) resizeObserver.observe(options.trigger.value)
    resizeObserver.observe(options.popup.value)
  }

  function handleDocumentClick(event: MouseEvent) {
    if (event.target instanceof Node && !containsTarget(event.target)) close()
  }

  function startListening() {
    if (listening || disposed) return
    document.addEventListener('click', handleDocumentClick, true)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    listening = true
  }

  function stopListening() {
    if (!listening) return
    document.removeEventListener('click', handleDocumentClick, true)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
    listening = false
  }

  function activate() {
    startListening()
  }

  function deactivate(restoreFocus: boolean) {
    closeChildBranches()
    stopListening()
    stopResizeObserver()
    const activeElement = document.activeElement
    const focusWasTransferred = activeElement !== null &&
      activeElement !== document.body &&
      activeElement.isConnected &&
      !containsTarget(activeElement)
    if (restoreFocus && !focusWasTransferred) options.focus()
  }

  const stopVisibleWatch = watch(
    options.visible,
    (visible, wasVisible) => {
      if (visible) activate()
      else if (wasVisible) deactivate(true)
    },
    { immediate: true, flush: 'sync' },
  )
  const stopElementWatch = watch(
    [options.visible, options.trigger, options.popup],
    ([visible, trigger, popup]) => {
      if (!visible || !trigger || !popup || disposed) return
      updatePosition()
      startResizeObserver()
    },
    { immediate: true, flush: 'post' },
  )
  const stopInteractiveWatch = watch(
    () => parentOverlay?.interactive.value,
    interactive => {
      if (interactive === false && options.visible.value) close()
    },
    { flush: 'sync' },
  )
  const unregisterCurrent = parentOverlay?.registerBranch({
    trigger: options.trigger,
    popup: options.popup,
    visible: options.visible,
    close,
    focus: options.focus,
  })

  function dispose() {
    if (disposed) return
    disposed = true
    stopVisibleWatch()
    stopElementWatch()
    stopInteractiveWatch()
    deactivate(false)
    unregisterCurrent?.()
    for (const unregister of [...childRegistrations]) unregister()
    childRegistrations.clear()
    childBranches.clear()
  }

  onBeforeUnmount(dispose)

  return {
    popupStyle,
    placement,
    overlayContext,
    childBranches,
    updatePosition,
    containsTarget,
    dispose,
  }
}
