import { computed, shallowRef } from 'vue'

interface OverlayEntry {
  id: symbol
  layer: number
}

const stack = shallowRef<OverlayEntry[]>([])
const bodyLocks = new Set<symbol>()
let previousOverflow = ''
let previousPaddingRight = ''

export const topOverlayId = computed(() => stack.value.at(-1)?.id)

export function enterOverlay(id: symbol, baseZIndex = 1000) {
  const existing = stack.value.find(entry => entry.id === id)
  if (existing) return existing.layer

  const highestLayer = stack.value.reduce(
    (highest, entry) => Math.max(highest, entry.layer),
    baseZIndex - 2,
  )
  const layer = Math.max(baseZIndex, highestLayer + 2)
  stack.value = [...stack.value, { id, layer }]
  return layer
}

export function leaveOverlay(id: symbol) {
  stack.value = stack.value.filter(entry => entry.id !== id)
}

export function isTopOverlay(id: symbol) {
  return topOverlayId.value === id
}

export function lockBody(id: symbol) {
  if (typeof document === 'undefined' || bodyLocks.has(id)) return

  if (bodyLocks.size === 0) {
    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
    const currentPadding = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  bodyLocks.add(id)
}

export function unlockBody(id: symbol) {
  if (typeof document === 'undefined' || !bodyLocks.delete(id) || bodyLocks.size > 0) return
  document.body.style.overflow = previousOverflow
  document.body.style.paddingRight = previousPaddingRight
}

export function resetOverlayManager() {
  if (typeof document !== 'undefined' && bodyLocks.size > 0) {
    document.body.style.overflow = previousOverflow
    document.body.style.paddingRight = previousPaddingRight
  }
  stack.value = []
  bodyLocks.clear()
  previousOverflow = ''
  previousPaddingRight = ''
}
