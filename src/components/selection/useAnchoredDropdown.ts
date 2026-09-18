import {
  computed,
  inject,
  onBeforeUnmount,
  ref,
  shallowReactive,
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
  layer?: Readonly<Ref<number>>
  /** Space reserved around the viewport, including any CSS popup margin. */
  viewportGutter?: number
  /** Keep false for controls whose popup must retain the trigger's width and left edge. */
  constrainWidth?: boolean
  /** Measure unconstrained content when a previous max-height has clipped the popup. */
  getPopupHeight?: (popup: HTMLElement) => number
  /** Consumers with their own blur and keyboard behavior can own focus restoration. */
  restoreFocus?: boolean
  /** Observe focus leaving any part of the control, including teleported descendants. */
  onFocusOut?: (event: FocusEvent) => void
  tabThroughPopup?: boolean
  close: () => void
  focus: () => void
}

export interface AnchoredDropdown {
  teleportTarget: ComputedRef<'body'>
  popupStyle: ComputedRef<CSSProperties>
  placement: Ref<'top' | 'bottom'>
  overlayContext: OverlayContext
  /** Persistent trigger content stays interactive when this popup is closed. */
  triggerOverlayContext: OverlayContext
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
  const layer = computed(() => options.layer?.value ?? Math.max(2000, (parentOverlay?.layer?.value ?? 0) + 1))
  const placement = ref<'top' | 'bottom'>('bottom')
  const teleportTarget = computed(() => 'body' as const)
  const geometry = ref<PopupGeometry>()
  const childBranches = shallowReactive(new Set<OverlayBranch>())
  const popupBranches = new Set<OverlayBranch>()
  const childRegistrations = new Set<() => void>()
  let resizeObserver: ResizeObserver | undefined
  let listening = false
  let focusListening = false
  let disposed = false
  const currentBranch: OverlayBranch = {
    trigger: options.trigger,
    popup: options.popup,
    visible: options.visible,
    tabThroughPopup: options.tabThroughPopup,
    close,
    focus: options.focus,
  }

  const popupStyle = computed<CSSProperties>(() => ({
    position: 'fixed',
    zIndex: layer.value,
    top: geometry.value ? `${geometry.value.top}px` : undefined,
    left: geometry.value ? `${geometry.value.left}px` : undefined,
    width: geometry.value ? `${geometry.value.width}px` : undefined,
    maxHeight: geometry.value ? `${geometry.value.maxHeight}px` : undefined,
  }))

  function registerBranch(branch: OverlayBranch, inPopup: boolean) {
    if (disposed) return () => undefined
    const ownsBranch = inPopup && !branch.owner
    if (ownsBranch) branch.owner = currentBranch
    childBranches.add(branch)
    if (inPopup) popupBranches.add(branch)
    const unregisterParent = parentOverlay?.registerBranch(branch)
    let registered = true
    const unregister = () => {
      if (!registered) return
      registered = false
      childBranches.delete(branch)
      popupBranches.delete(branch)
      unregisterParent?.()
      if (ownsBranch) branch.owner = undefined
      childRegistrations.delete(unregister)
    }
    childRegistrations.add(unregister)
    return unregister
  }

  const overlayContext: OverlayContext = {
    layer,
    interactive: computed(() =>
      options.visible.value && parentOverlay?.interactive.value !== false,
    ),
    registerBranch: branch => registerBranch(branch, true),
  }
  const triggerOverlayContext: OverlayContext = {
    layer: parentOverlay?.layer,
    interactive: computed(() => parentOverlay?.interactive.value !== false),
    registerBranch: branch => registerBranch(branch, false),
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

  function closeChildBranches(includeTriggerContent = false) {
    const branches = includeTriggerContent ? childBranches : popupBranches
    for (const branch of [...branches].reverse()) {
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
    const popupHeight = options.getPopupHeight?.(popup) ?? popup.getBoundingClientRect().height
    const gutter = options.viewportGutter ?? VIEWPORT_GUTTER
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const maximumWidth = Math.max(0, viewportWidth - gutter * 2)
    const desiredWidth = Math.max(triggerRect.width, options.minWidth?.value ?? 0)
    const preserveWidth = options.constrainWidth === false
    const width = preserveWidth
      ? desiredWidth
      : Math.min(maximumWidth, desiredWidth)
    const viewportTop = gutter
    const viewportBottom = Math.max(
      viewportTop,
      viewportHeight - gutter,
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
    const opensAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow
    const availableHeight = opensAbove ? spaceAbove : spaceBelow
    const visibleHeight = Math.min(popupHeight, availableHeight)
    const furthestLeft = Math.max(
      gutter,
      viewportWidth - width - gutter,
    )

    placement.value = opensAbove ? 'top' : 'bottom'
    const nextGeometry: PopupGeometry = {
      top: opensAbove ? triggerTop - visibleHeight : triggerBottom,
      left: preserveWidth
        ? triggerRect.left
        : Math.max(gutter, Math.min(triggerRect.left, furthestLeft)),
      width,
      maxHeight: availableHeight,
    }
    const previousGeometry = geometry.value
    // A popup ref can be replaced during a render; unchanged measurements must settle.
    if (
      previousGeometry?.top === nextGeometry.top &&
      previousGeometry.left === nextGeometry.left &&
      previousGeometry.width === nextGeometry.width &&
      previousGeometry.maxHeight === nextGeometry.maxHeight
    ) return
    geometry.value = nextGeometry
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

  function handleDocumentFocusOut(event: FocusEvent) {
    if (event.target instanceof Node && containsTarget(event.target)) options.onFocusOut?.(event)
  }

  function setFocusListening(active: boolean) {
    if (active && !focusListening && !disposed) {
      document.addEventListener('focusout', handleDocumentFocusOut, true)
      focusListening = true
    } else if (!active && focusListening) {
      document.removeEventListener('focusout', handleDocumentFocusOut, true)
      focusListening = false
    }
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
    if (restoreFocus && options.restoreFocus !== false && !focusWasTransferred) options.focus()
  }

  const stopVisibleWatch = watch(
    options.visible,
    (visible, wasVisible) => {
      if (visible) activate()
      else if (wasVisible) deactivate(true)
    },
    { immediate: true, flush: 'sync' },
  )
  const stopFocusWatch = options.onFocusOut ? watch(
    () => options.visible.value || [...childBranches].some(branch => branch.visible.value),
    setFocusListening,
    { immediate: true, flush: 'sync' },
  ) : undefined
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
  const unregisterCurrent = parentOverlay?.registerBranch(currentBranch)

  function dispose() {
    if (disposed) return
    disposed = true
    stopVisibleWatch()
    stopElementWatch()
    stopInteractiveWatch()
    stopFocusWatch?.()
    setFocusListening(false)
    deactivate(false)
    closeChildBranches(true)
    unregisterCurrent?.()
    for (const unregister of [...childRegistrations]) unregister()
    childRegistrations.clear()
    childBranches.clear()
    popupBranches.clear()
  }

  onBeforeUnmount(dispose)

  return {
    teleportTarget,
    popupStyle,
    placement,
    overlayContext,
    triggerOverlayContext,
    childBranches,
    updatePosition,
    containsTarget,
    dispose,
  }
}
