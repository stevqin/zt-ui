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
      { 'is-dragging': dragging },
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
        {{ current === 0 ? '›' : '‹' }}
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
    &--second {
      flex: 1;
    }
  }
  &__handle {
    flex: none;
    width: 12px;
    position: relative;
    background: var(--glass-info-soft);
    [role='separator'] {
      position: absolute;
      inset: 0;
      cursor: col-resize;
      touch-action: none;
      &:focus-visible {
        outline: 2px solid var(--glass-accent);
        outline-offset: -2px;
      }
    }
    button {
      position: absolute;
      top: 50%;
      left: 0;
      width: 12px;
      transform: translateY(-50%);
      padding: 8px 0;
      border: 0;
      border-radius: glass.radius(3px);
      background: var(--glass-line);
      color: var(--glass-default-ink);
      cursor: pointer;
    }
  }
  &--vertical {
    flex-direction: column;
    height: 100%;
    min-height: 120px;
    .zt-splitter__handle {
      height: 12px;
      width: 100%;
      [role='separator'] {
        cursor: row-resize;
      }
      button {
        top: 0;
        left: 50%;
        transform: none;
        padding: 0 8px;
        width: 28px;
        height: 12px;
        line-height: 10px;
      }
    }
  }
  &.is-dragging {
    user-select: none;
  }
}
</style>
