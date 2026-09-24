<script setup lang="ts">
import { ref, useId, watch, onBeforeUnmount } from 'vue';
import ZtPopover from '../popover/ZtPopover.vue';
import type { ZtTooltipProps } from './types';
defineOptions({ name: 'ZtTooltip' });
const props = withDefaults(defineProps<ZtTooltipProps>(), {
  content: '',
  width: 'max-content',
  disabled: false,
  placement: 'top',
  openDelay: 200,
  closeDelay: 100,
  showArrow: true,
});
const emit = defineEmits<{ 'update:visible': [visible: boolean] }>(),
  open = ref(!props.disabled && (props.visible ?? false)),
  id = useId();
let timer: ReturnType<typeof setTimeout> | undefined;
let hovered = false,
  focused = false,
  popupHovered = false;
function pointer(value: boolean, popup = false) {
  if (popup) popupHovered = value;
  else hovered = value;
  show(
    hovered || focused || popupHovered,
    value ? props.openDelay : props.closeDelay,
  );
}
function focus(value: boolean, event?: FocusEvent) {
  if (
    !value &&
    event?.currentTarget instanceof HTMLElement &&
    event.currentTarget.contains(event.relatedTarget as Node)
  )
    return;
  focused = value;
  show(hovered || focused || popupHovered);
}
function escape() {
  hovered = false;
  focused = false;
  popupHovered = false;
  clearTimeout(timer);
  open.value = false;
  emit('update:visible', false);
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    escape();
  }
}
function show(value: boolean, delay = 0) {
  clearTimeout(timer);
  if (value && props.disabled) return;
  timer = setTimeout(() => {
    open.value = value;
    emit('update:visible', value);
  }, delay);
}
watch(
  () => props.visible,
  (v) => {
    if (v !== undefined) open.value = v && !props.disabled;
  },
);
watch(
  () => props.disabled,
  (v) => {
    if (v) {
      hovered = false;
      focused = false;
      popupHovered = false;
      clearTimeout(timer);
      open.value = false;
      emit('update:visible', false);
    }
  },
);
onBeforeUnmount(() => {
  clearTimeout(timer);
  document.removeEventListener('keydown', onKeydown, true);
});
watch(
  open,
  (value) => {
    if (value) document.addEventListener('keydown', onKeydown, true);
    else document.removeEventListener('keydown', onKeydown, true);
  },
  { immediate: true },
);
</script>
<template>
  <ZtPopover
    :visible="open"
    trigger="manual"
    :placement="placement"
    :width="width"
    :height="height"
    @update:visible="value => { if (!value && open) escape() }"
    :disabled="disabled"
    :show-arrow="showArrow"
    :restore-focus="false"
    ><span
      class="zt-tooltip__trigger"
      tabindex="0"
      :aria-describedby="open ? id : undefined"
      @pointerenter="pointer(true)"
      @pointerleave="pointer(false)"
      @focusin="focus(true)"
      @focusout="focus(false, $event)"
      @keydown.esc.stop="escape"
      @click="escape"
      ><slot /></span
    ><template #content
      ><span
        :id="id"
        role="tooltip"
        @pointerenter="pointer(true, true)"
        @pointerleave="pointer(false, true)"
        ><slot name="content">{{ content }}</slot></span
      ></template
    ></ZtPopover
  >
</template>
<style scoped>
.zt-tooltip__trigger {
  display: inline-flex;
  align-items: center;
}
.zt-tooltip__trigger:focus-visible {
  outline: 2px solid var(--zt-accent, #245edb);
  outline-offset: 3px;
  border-radius: var(--zt-radius, 11px);
}
</style>
