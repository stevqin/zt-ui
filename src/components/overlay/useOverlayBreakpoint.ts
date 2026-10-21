import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/** Share responsive fullscreen behavior without changing the explicit model. */
export function useOverlayBreakpoint(breakpoint: () => number | undefined, visible: Readonly<Ref<boolean>>) {
  const narrow = ref(false)
  let media: MediaQueryList | undefined
  const update = () => { narrow.value = media?.matches ?? false }
  function remove() {
    if (media?.removeEventListener) media.removeEventListener('change', update)
    else media?.removeListener(update)
    media = undefined
  }
  watch([breakpoint, visible], ([value, open]) => {
    remove()
    // The closing panel still paints its last geometry during leave.
    if (!open) return
    if (value && value > 0 && typeof window !== 'undefined' && window.matchMedia) {
      media = window.matchMedia(`(max-width: ${value - .02}px)`)
      if (media.addEventListener) media.addEventListener('change', update)
      else media.addListener(update)
    }
    update()
  }, {immediate: true, flush: 'sync'})
  onBeforeUnmount(remove)
  return narrow
}
