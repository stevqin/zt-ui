<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { ZtSplitterProps, ZtSplitterEmits } from './types';
const props = withDefaults(defineProps<ZtSplitterProps>(), {
  modelValue: 50,
  direction: 'horizontal',
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  collapsible: false,
  label: '调整分栏大小',
});
const emit = defineEmits<ZtSplitterEmits>();
const root = ref<HTMLElement>(),
  dragging = ref(false);
const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;
const low = computed(() => Math.min(100, Math.max(0, finite(props.min, 0))));
const high = computed(() =>
  Math.max(low.value, Math.min(100, finite(props.max, 100))),
);
const bound = (value: number) =>
  Math.max(low.value, Math.min(high.value, finite(value, 50)));
const current = computed(() =>
  props.collapsible && props.modelValue === 0 ? 0 : bound(props.modelValue),
);
let previous = 50,
  last = 50,
  pointerId: number | undefined;
watch(
  current,
  (value) => {
    if (value > 0) previous = value;
  },
  { immediate: true },
);
function update(value: number) {
  last = value;
  emit('update:modelValue', value);
  emit('change', value);
}
function collapse() {
  if (props.disabled) return;
  const collapsed = current.value !== 0;
  update(collapsed ? 0 : bound(previous));
  emit('collapse', collapsed);
}
function keydown(event: KeyboardEvent) {
  if (props.disabled) return;
  let value: number | undefined;
  const step = Math.max(0.1, finite(props.step, 1)) * (event.shiftKey ? 10 : 1);
  if (event.key === 'Home') value = low.value;
  else if (event.key === 'End') value = high.value;
  else if (
    event.key === (props.direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp')
  )
    value = bound(current.value - step);
  else if (
    event.key ===
    (props.direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown')
  )
    value = bound(current.value + step);
  else if (event.key === 'Enter' && props.collapsible) {
    event.preventDefault();
    collapse();
    return;
  }
  if (value !== undefined) {
    event.preventDefault();
    update(value);
  }
}
function move(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId || !root.value) return;
  const rect = root.value.getBoundingClientRect();
  const length = props.direction === 'horizontal' ? rect.width : rect.height;
  if (length <= 0) return;
  const position =
    props.direction === 'horizontal'
      ? event.clientX - rect.left
      : event.clientY - rect.top;
  update(bound((position / length) * 100));
}
function cleanup() {
  window.removeEventListener('pointermove', move);
  window.removeEventListener('pointerup', stop);
  window.removeEventListener('pointercancel', stop);
  dragging.value = false;
  pointerId = undefined;
}
function stop(event?: PointerEvent) {
  if (!dragging.value || (event && event.pointerId !== pointerId)) return;
  cleanup();
  emit('resize-end', last);
}
function start(event: PointerEvent) {
  if (props.disabled || dragging.value || event.button !== 0) return;
  event.preventDefault();
  pointerId = event.pointerId;
  last = current.value;
  dragging.value = true;
  emit('resize-start');
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
}
watch(
  () => props.disabled,
  (value) => {
    if (value) stop();
  },
);
onBeforeUnmount(cleanup);
</script>
<template>
  <div
    ref="root"
    :class="[
      'zt-splitter',
      `zt-splitter--${direction}`,
      { 'is-dragging': dragging, 'is-collapsed': current === 0, 'is-disabled': disabled },
    ]"
  >
    <div
      class="zt-splitter__pane"
      :style="{ flexBasis: current + '%' }"
      :inert="current === 0 || undefined"
    >
      <slot name="first" />
    </div>
    <div class="zt-splitter__handle">
      <div
        role="separator"
        :tabindex="disabled ? -1 : 0"
        :aria-label="label"
        :aria-orientation="
          direction === 'horizontal' ? 'vertical' : 'horizontal'
        "
        :aria-valuemin="collapsible ? 0 : low"
        :aria-valuemax="high"
        :aria-valuenow="current"
        :aria-disabled="disabled"
        @pointerdown="start"
        @keydown="keydown"
      />
      <button
        v-if="collapsible"
        type="button"
        :disabled="disabled"
        :aria-label="current === 0 ? '展开第一栏' : '收起第一栏'"
        :aria-expanded="current !== 0"
        @click="collapse"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
      </button>
    </div>
    <div class="zt-splitter__pane zt-splitter__pane--second">
      <slot name="second" />
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-splitter {
  @include glass.tokens;
  box-sizing: border-box;
  display: flex;
  min-width: 0;
  min-height: 0;
  width: 100%;
  color: var(--glass-default-ink);
  border: 1px solid var(--glass-line);
  border-radius: glass.radius(11px);
  overflow: hidden;
  &__pane {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    flex-shrink: 1;
    transition: flex-basis 280ms cubic-bezier(.22, 1, .36, 1);
    &--second { flex: 1; }
  }
  &__handle {
    flex: none;
    width: 2px;
    position: relative;
    background: var(--glass-line);
    transition: background-color 160ms;
    &:hover { background: var(--glass-accent-line); }
    > [role='separator'] {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -5px;
      width: 12px;
      z-index: 1;
      cursor: col-resize;
      touch-action: none;
      &:focus-visible {
        outline: var(--zt-focus-ring-width, 0px) solid var(--glass-accent);
        outline-offset: -2px;
      }
      &[aria-disabled='true'] { cursor: default; }
    }
    > button {
      box-sizing: border-box;
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 16px;
      height: 36px;
      transform: translate(-50%, -50%);
      padding: 0;
      border: 1px solid var(--glass-line);
      border-radius: glass.radius(5px);
      background: var(--zt-surface, #fff);
      box-shadow: 0 1px 4px rgba(15, 23, 42, .1);
      color: var(--glass-default-ink);
      cursor: pointer;
      transition: transform 280ms cubic-bezier(.22, 1, .36, 1), background-color 160ms, border-color 160ms;
      > svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: transform 280ms cubic-bezier(.22, 1, .36, 1); }
      &:hover:not(:disabled) { background: var(--glass-accent-soft); border-color: var(--glass-accent-line); color: var(--glass-accent-ink); }
      &:focus-visible { outline: var(--zt-focus-ring-width, 0px) solid var(--glass-accent); outline-offset: -2px; }
      &:disabled { opacity: .5; cursor: not-allowed; }
    }
  }
  &--vertical {
    flex-direction: column;
    height: 100%;
    min-height: 120px;
    > .zt-splitter__handle {
      height: 2px;
      width: 100%;
      > [role='separator'] { top: -5px; bottom: auto; left: 0; width: 100%; height: 12px; cursor: row-resize; }
      > button { width: 36px; height: 16px; }
      > button > svg { transform: rotate(90deg); }
    }
  }
  &.is-collapsed > .zt-splitter__handle > [role='separator'] { left: 0; }
  &--vertical.is-collapsed > .zt-splitter__handle > [role='separator'] { top: 0; }
  &.is-collapsed > .zt-splitter__handle > button { left: 0; transform: translate(0, -50%); }
  &.is-collapsed > .zt-splitter__handle > button > svg { transform: rotate(180deg); }
  &--vertical.is-collapsed > .zt-splitter__handle > button { top: 0; left: 50%; transform: translate(-50%, 0); }
  &--vertical.is-collapsed > .zt-splitter__handle > button > svg { transform: rotate(270deg); }
  &.is-disabled > .zt-splitter__handle { background: var(--glass-line); }
  &.is-dragging {
    user-select: none;
    > .zt-splitter__handle { background: var(--glass-accent); }
    > .zt-splitter__pane,
    > .zt-splitter__handle > button,
    > .zt-splitter__handle > button > svg { transition: none; }
  }
}
@media (prefers-reduced-motion: reduce) {
  .zt-splitter > .zt-splitter__pane,
  .zt-splitter > .zt-splitter__handle,
  .zt-splitter > .zt-splitter__handle > button,
  .zt-splitter > .zt-splitter__handle > button > svg { transition: none; }
}
</style>
