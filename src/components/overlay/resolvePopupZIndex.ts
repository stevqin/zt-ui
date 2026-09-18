// zt-alert owns .zt-drawer; local Drawer styles remain isolated to .zt-drawer-surface.
const overlayAncestorSelector = '.zt-modal, .zt-drawer-surface, .zt-drawer, .zt-select__dropdown'

/** Place a teleported popup above both its Vue overlay scope and its DOM container. */
export function resolvePopupZIndex(trigger: HTMLElement | undefined, inheritedLayer?: number): number {
  const inheritedZIndex = inheritedLayer !== undefined && Number.isFinite(inheritedLayer)
    ? Math.max(2000, Math.floor(inheritedLayer) + 1)
    : 2000
  const ancestor = trigger?.closest<HTMLElement>(overlayAncestorSelector)
  if (!ancestor) return inheritedZIndex
  const layer = Number.parseFloat(ancestor.style.zIndex || getComputedStyle(ancestor).zIndex)
  return Number.isFinite(layer) ? Math.max(inheritedZIndex, Math.floor(layer) + 1) : inheritedZIndex
}
