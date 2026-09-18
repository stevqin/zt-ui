<script setup lang="ts">
import {
  Teleport,
  computed,
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type CSSProperties,
} from 'vue';
import { useZtConfig } from '../config-provider/context';
import { overlayContextKey, type OverlayBranch } from '../overlay/context';
import { placePopover } from './position';
import type { ZtPopoverPlacement, ZtPopoverProps } from './types';
import './popover.scss';
defineOptions({ name: 'ZtPopover' });
const props = withDefaults(defineProps<ZtPopoverProps>(), {
  visible: false,
  trigger: 'click',
  placement: 'bottom',
  offset: 8,
  disabled: false,
  showArrow: true,
  teleported: true,
  openDelay: 0,
  closeDelay: 100,
  zIndex: 1000,
  persistent: false,
  restoreFocus: true,
});
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'before-enter': [];
  'after-enter': [];
  'before-leave': [];
  'after-leave': [];
}>();
const config = useZtConfig(),
  parentOverlay = inject(overlayContextKey, undefined),
  reference = ref<HTMLElement>(),
  popup = ref<HTMLElement>(),
  content = ref<HTMLElement>(),
  opened = ref(props.visible),
  layer = ref(props.zIndex),
  actualPlacement = ref<ZtPopoverPlacement>(props.placement),
  position = ref({ top: 0, left: 0, arrowX: 0, arrowY: 0 });
let openTimer: number | undefined,
  closeTimer: number | undefined,
  resizeObserver: ResizeObserver | undefined;
// Use the same branch graph as anchored dropdowns and Modal focus scopes.
// Only popup-slot descendants belong to this transient branch; trigger content
// retains the surrounding context even while this popup is closed.
const childBranches = new Set<OverlayBranch>();
const childRegistrations = new Set<() => void>();
const currentBranch: OverlayBranch = {
  trigger: reference,
  popup,
  visible: opened,
  close: () => void setVisible(false),
  focus: focusReference,
  tabThroughPopup: true,
};
const unregister = parentOverlay?.registerBranch(currentBranch);
const PopupScope = defineComponent({
  name: 'ZtPopoverPopupScope',
  setup(_, { slots }) {
    provide(overlayContextKey, {
      layer,
      interactive: computed(() => opened.value && parentOverlay?.interactive.value !== false),
      registerBranch(branch) {
        const ownsBranch = !branch.owner;
        if (ownsBranch) branch.owner = currentBranch;
        childBranches.add(branch);
        const unregisterParent = parentOverlay?.registerBranch(branch);
        const unregisterChild = () => {
          childBranches.delete(branch);
          unregisterParent?.();
          if (ownsBranch) branch.owner = undefined;
          childRegistrations.delete(unregisterChild);
        };
        childRegistrations.add(unregisterChild);
        return unregisterChild;
      },
    });
    return () => slots.default?.();
  },
});
function closeChildren() {
  for (const branch of [...childBranches].reverse()) {
    if (branch.visible.value) branch.close();
  }
}
function containsTarget(target: Node | null) {
  return !!target && (reference.value?.contains(target) || popup.value?.contains(target)
    || [...childBranches].some(branch => branch.visible.value
      && (branch.trigger.value?.contains(target) || branch.popup.value?.contains(target))));
}
const width = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
);
const height = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
);
const popupStyle = computed<CSSProperties>(() => ({
  ...config.style.value,
  position: 'fixed',
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  width: width.value,
  height: height.value,
  zIndex: Math.max(props.zIndex, layer.value),
  '--zt-popover-arrow-x': `${position.value.arrowX}px`,
  '--zt-popover-arrow-y': `${position.value.arrowY}px`,
}));
function clearTimers() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  openTimer = closeTimer = undefined;
}
function focusReference() {
  (
    reference.value?.querySelector<HTMLElement>(
      'button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
    ) ?? reference.value
  )?.focus({ preventScroll: true });
}
function updatePosition() {
  if (!reference.value || !popup.value) return;
  let nextLayer = props.zIndex;
  for (let node: HTMLElement | null = reference.value; node; node = node.parentElement) {
    const z = Number.parseFloat(getComputedStyle(node).zIndex);
    if (Number.isFinite(z)) nextLayer = Math.max(nextLayer, z + 1);
  }
  layer.value = nextLayer;
  const a = reference.value.getBoundingClientRect(),
    b = popup.value.getBoundingClientRect(),
    next = placePopover(
      a,
      { width: b.width, height: b.height },
      { width: window.innerWidth, height: window.innerHeight, padding: 8 },
      props.placement,
      props.offset,
    );
  actualPlacement.value = next.placement;
  position.value = {
    top: next.top,
    left: next.left,
    arrowX: next.arrowX ?? 0,
    arrowY: next.arrowY ?? 0,
  };
}
async function setVisible(value: boolean) {
  if ((value && (props.disabled || parentOverlay?.interactive.value === false)) || opened.value === value) return;
  clearTimers();
  if (value) emit('before-enter');
  else {
    emit('before-leave');
    closeChildren();
  }
  opened.value = value;
  emit('update:visible', value);
  if (value) {
    bind();
    await nextTick();
    if (!opened.value) return;
    observeSize();
    updatePosition();
    emit('after-enter');
  } else {
    unbind();
    emit('after-leave');
    if (props.restoreFocus) focusReference();
  }
}
function show() {
  if (props.trigger === 'manual' && !props.visible) return;
  void setVisible(true);
}
function hide() {
  if (props.trigger === 'manual') return;
  void setVisible(false);
}
function toggle() {
  opened.value ? hide() : show();
}
function delayed(value: boolean) {
  clearTimeout(value ? closeTimer : openTimer);
  const delay = value ? props.openDelay : props.closeDelay;
  const timer = window.setTimeout(() => void setVisible(value), delay);
  if (value) openTimer = timer;
  else closeTimer = timer;
}
function click() {
  if (props.trigger === 'click') toggle();
}
function enter() {
  if (props.trigger === 'hover') delayed(true);
}
function leave() {
  if (props.trigger === 'hover') delayed(false);
}
function focusIn() {
  if (props.trigger === 'focus') void setVisible(true);
}
function focusOut(event: FocusEvent) {
  if (
    props.trigger === 'focus' &&
    !containsTarget(event.relatedTarget as Node)
  )
    void setVisible(false);
}
function outside(event: PointerEvent) {
  const target = event.target as Node;
  if (
    props.trigger !== 'manual' &&
    !containsTarget(target)
  )
    void setVisible(false);
}
function key(event: KeyboardEvent) {
  if (event.defaultPrevented || event.isComposing || parentOverlay?.interactive.value === false) return;
  // Ancestors register their document listener first. Leave this event to the
  // deepest visible child (including Tooltip's own manual trigger handler).
  if ([...childBranches].some(branch => branch.visible.value)) return;
  if (event.key === 'Escape' && props.trigger !== 'manual') {
    event.preventDefault();
    event.stopImmediatePropagation();
    void setVisible(false);
  }
}
function observeSize() {
  resizeObserver?.disconnect();
  if (typeof ResizeObserver === 'undefined') return;
  resizeObserver = new ResizeObserver(() => {
    if (opened.value) updatePosition();
  });
  for (const element of [reference.value, popup.value, content.value]) {
    if (element) resizeObserver.observe(element);
  }
}
function bind() {
  document.addEventListener('pointerdown', outside, true);
  document.addEventListener('keydown', key, true);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
}
function unbind() {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  document.removeEventListener('pointerdown', outside, true);
  document.removeEventListener('keydown', key, true);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
}
watch(
  () => props.visible,
  (value) => {
    if (value !== opened.value) void setVisible(value);
  },
);
watch(
  () => [props.width, props.height, props.placement, props.offset, props.showArrow],
  () => { if (opened.value) updatePosition(); },
  { flush: 'post' },
);
watch(
  () => parentOverlay?.interactive.value,
  interactive => { if (interactive === false) void setVisible(false); },
  { flush: 'sync' },
);
onMounted(() => {
  if (opened.value) {
    bind();
    void nextTick(() => {
      if (!opened.value) return;
      observeSize();
      updatePosition();
    });
  }
});
onBeforeUnmount(() => {
  clearTimers();
  closeChildren();
  unbind();
  unregister?.();
  for (const unregisterChild of [...childRegistrations]) unregisterChild();
});
defineExpose({
  show: () => void setVisible(true),
  hide: () => void setVisible(false),
  toggle,
  updatePosition,
});
</script>
<template>
  <span
    ref="reference"
    class="zt-popover__reference"
    :aria-expanded="opened"
    @click="click"
    @pointerenter="enter"
    @pointerleave="leave"
    @focusin="focusIn"
    @focusout="focusOut"
    ><slot /></span
  ><Teleport :to="teleported ? 'body' : undefined" :disabled="!teleported"
    ><Transition name="zt-popover"
      ><div
        v-if="opened || persistent"
        v-show="opened"
        ref="popup"
        class="zt-popover"
        :class="[`zt-popover--${actualPlacement}`, {'zt-popover--sized-width': width !== undefined}]"
        :style="popupStyle"
        role="dialog"
        tabindex="-1"
        @pointerenter="enter"
        @pointerleave="leave"
        @focusout="focusOut"
      >
        <span v-if="showArrow" class="zt-popover__arrow" />
        <div ref="content" class="zt-popover__content">
          <PopupScope><slot name="content" /></PopupScope>
        </div></div></Transition
  ></Teleport>
</template>
