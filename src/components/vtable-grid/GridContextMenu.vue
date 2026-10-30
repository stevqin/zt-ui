<script lang="ts">
export interface GridContextMenuItem {
  type: string
  text?: string
  icon?: string
  status?: string
  color?: string
  visible?: boolean
  disabled?: boolean
  divided?: boolean
  handler?: (...args: never[]) => unknown
}
</script>
<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { overlayContextKey } from '../overlay/context'
import { resolvePopupZIndex } from '../overlay/resolvePopupZIndex'
import { useZtConfig } from '../config-provider/context'

defineOptions({ name: 'GridContextMenu' })
const props = defineProps<{ items: GridContextMenuItem[]; x: number; y: number }>()
const emit = defineEmits<{ choose: [item: GridContextMenuItem]; close: [] }>()
const configStyle = useZtConfig().style
const menu = ref<HTMLElement>()
const trigger = ref<HTMLElement>()
const visible = ref(true)
const parentOverlay = inject(overlayContextKey, undefined)
const position = ref({ left: props.x, top: props.y })
const layer = ref(2000)
const items = computed(() => props.items.filter(item => item.visible !== false))
let previous: HTMLElement | undefined
let unregister: (() => void) | undefined
let observer: ResizeObserver | undefined
let disposed = false
let closing = false
const buttons = () => [...(menu.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
function close() { if (closing) return; closing = true; emit('close') }
function focus() { (buttons()[0] ?? menu.value)?.focus() }
function place() {
  const bounds = menu.value?.getBoundingClientRect()
  position.value = {
    left: Math.max(8, Math.min(props.x, window.innerWidth - (bounds?.width ?? 0) - 8)),
    top: Math.max(8, Math.min(props.y, window.innerHeight - (bounds?.height ?? 0) - 8)),
  }
}
function choose(item: GridContextMenuItem) {
  if (item.disabled || item.visible === false) return
  emit('choose', item)
  close()
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
  if (event.key === 'Tab') { close(); return }
  const available = buttons()
  if (!available.length) return
  const index = available.indexOf(document.activeElement as HTMLButtonElement)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1
    : event.key === 'ArrowDown' ? (index + 1) % available.length
    : event.key === 'ArrowUp' ? (index - 1 + available.length) % available.length : -1
  if (next >= 0) { event.preventDefault(); available[next].focus() }
}
function outside(event: Event) {
  if (event.target instanceof Node && !menu.value?.contains(event.target)) close()
}
watch(() => [props.x, props.y, props.items], async () => { await nextTick(); if (!disposed) place() }, { deep: true })
onMounted(() => {
  previous = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  trigger.value = previous
  layer.value = resolvePopupZIndex(previous, parentOverlay?.layer?.value)
  unregister = parentOverlay?.registerBranch({ trigger, popup: menu, visible, tabThroughPopup: false, close, focus })
  place()
  focus()
  document.addEventListener('pointerdown', outside, true)
  window.addEventListener('resize', place)
  if (typeof ResizeObserver !== 'undefined' && menu.value) { observer = new ResizeObserver(place); observer.observe(menu.value) }
})
onBeforeUnmount(() => {
  disposed = true
  visible.value = false
  const active = document.activeElement
  const restore = active === document.body || active === menu.value || (active instanceof Node && menu.value?.contains(active))
  observer?.disconnect()
  unregister?.()
  document.removeEventListener('pointerdown', outside, true)
  window.removeEventListener('resize', place)
  if (restore && previous?.isConnected) previous.focus()
})
</script>
<template>
  <div ref="menu" class="zt-grid-context-menu" role="menu" aria-label="表格操作" tabindex="-1" :style="{ ...configStyle, left: `${position.left}px`, top: `${position.top}px`, zIndex: layer }" @keydown="keydown" @contextmenu.prevent>
    <template v-for="(item, index) in items" :key="`${item.type}-${index}`">
      <div v-if="item.divided && index > 0" class="zt-grid-context-menu__divider" role="separator" />
      <button type="button" role="menuitem" tabindex="-1" :disabled="item.disabled" :aria-disabled="item.disabled || undefined" :data-status="item.status" :style="item.color ? { color: item.color } : undefined" @click="choose(item)">
        <span v-if="item.icon" aria-hidden="true">{{ item.icon }}</span><span>{{ item.text ?? item.type }}</span>
      </button>
    </template>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens.scss' as glass;
.zt-grid-context-menu {
  @include glass.tokens;
  position: fixed;
  box-sizing: border-box;
  min-width: min(160px, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  overflow: auto;
  padding: 5px;
  border: 1px solid var(--glass-line);
  border-radius: glass.radius(10px);
  background: var(--zt-panel-bg, #fff);
  color: var(--glass-ink);
  box-shadow: var(--zt-shadow, 0 8px 28px rgb(20 30 50 / 16%));
  font: var(--glass-size-default)/1.5 var(--glass-font);
  button {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 0;
    border-radius: glass.radius(6px);
    padding: 6px 10px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    overflow-wrap: anywhere;
    cursor: pointer;
    &:hover:not(:disabled), &:focus-visible { background: var(--glass-accent-soft); outline: 2px solid var(--glass-accent); outline-offset: -2px; }
    &:disabled { opacity: .45; cursor: not-allowed; }
    &[data-status='danger'] { color: var(--zt-danger, #ef4444); }
    &[data-status='primary'] { color: var(--glass-accent-ink); }
  }
  &__divider { height: 1px; margin: 4px 5px; background: var(--glass-line); }
}
</style>
