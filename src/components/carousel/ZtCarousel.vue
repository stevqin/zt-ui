<script setup lang="ts">
import {
  ref,
  Transition,
  computed,
  Comment,
  Fragment,
  Text,
  type VNode,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue';
import type { ZtCarouselProps, ZtCarouselEmits } from './types';
const props = withDefaults(defineProps<ZtCarouselProps>(), {
  autoplay: false,
  interval: 3000,
  loop: true,
  arrows: true,
  indicators: true,
  height: 240,
  label: '图片轮播',
});
const emit = defineEmits<ZtCarouselEmits>(),
  slots = defineSlots<{ default?: () => VNode[] }>(),
  root = ref<HTMLElement>(),
  direction = ref(1),
  hovered = ref(false),
  focused = ref(false),
  hidden = ref(false),
  reduced = ref(false),
  count = ref(0),
  internal = ref(0);
function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((n) =>
    n.type === Comment || (n.type === Text && !String(n.children).trim())
      ? []
      : n.type === Fragment && Array.isArray(n.children)
        ? flatten(n.children as VNode[])
        : [n],
  );
}
function slides() {
  const nodes = flatten(slots.default?.() ?? []);
  // Update count during render list build; guarded to avoid redundant writes.
  if (count.value !== nodes.length) count.value = nodes.length;
  return nodes;
}
const current = computed(() =>
  Math.max(
    0,
    Math.min(
      Math.max(0, count.value - 1),
      Number.isFinite(props.modelValue ?? internal.value)
        ? Math.floor(props.modelValue ?? internal.value)
        : 0,
    ),
  ),
);
let requested: { index: number; direction: number } | undefined;
function goTo(index: number) {
  if (count.value < 2 || !Number.isFinite(index)) return;
  index = Math.floor(index);
  const movement = index > current.value ? 1 : -1;
  const next = props.loop
    ? ((index % count.value) + count.value) % count.value
    : Math.max(0, Math.min(count.value - 1, index));
  if (next !== current.value) {
    requested = { index: next, direction: movement };
    if (props.modelValue === undefined) internal.value = next;
    emit('update:modelValue', next);
    emit('change', next);
  }
}
const next = () => goTo(current.value + 1),
  prev = () => goTo(current.value - 1);
function keydown(event: KeyboardEvent) {
  if (
    event.target instanceof HTMLElement &&
    event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="slider"],[role="spinbutton"],[role="combobox"]')
  )
    return;
  const action =
    event.key === 'ArrowRight'
      ? next
      : event.key === 'ArrowLeft'
        ? prev
        : event.key === 'Home'
          ? () => goTo(0)
          : event.key === 'End'
            ? () => goTo(count.value - 1)
            : undefined;
  if (action) {
    event.preventDefault();
    action();
  }
}
let touchX: number | undefined,
  touchY: number | undefined,
  timer: ReturnType<typeof setInterval> | undefined,
  media: MediaQueryList | undefined;
function touchStart(event: TouchEvent) {
  if (event.touches.length !== 1) { touchX = undefined; return; }
  touchX = event.touches[0]?.clientX;
  touchY = event.touches[0]?.clientY;
}
function touchEnd(event: TouchEvent) {
  const end = event.changedTouches[0]?.clientX;
  const vertical = Math.abs((event.changedTouches[0]?.clientY ?? touchY ?? 0) - (touchY ?? 0));
  if (touchX !== undefined && end !== undefined && Math.abs(end - touchX) >= 40 && Math.abs(end - touchX) > vertical)
    (end < touchX ? next : prev)();
  touchX = undefined;
}
function stop() {
  if (timer !== undefined) clearInterval(timer);
  timer = undefined;
}
function restart() {
  stop();
  if (
    props.autoplay &&
    count.value > 1 &&
    !hovered.value &&
    !focused.value &&
    !hidden.value &&
    !reduced.value
  )
    timer = setInterval(
      next,
      Math.max(100, Number.isFinite(props.interval) ? props.interval : 3000),
    );
}
function visibility() {
  hidden.value = document.hidden;
}
function preference() {
  reduced.value = media?.matches ?? false;
}
function focusOut(event: FocusEvent) {
  if (
    !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)
  )
    focused.value = false;
}
watch(count, () => {
  if (props.modelValue === undefined) internal.value = current.value;
});
watch(current, (value, old) => {
  direction.value = requested?.index === value ? requested.direction : value > old ? 1 : -1;
  requested = undefined;
  const active = typeof document !== 'undefined' ? document.activeElement : null;
  const outgoing = root.value?.querySelectorAll('.zt-carousel__slide')[old];
  if (active && outgoing?.contains(active)) root.value?.focus({ preventScroll: true });
});
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined && Number.isFinite(value))
      internal.value = Math.floor(value);
  },
  { immediate: true },
);
watch(
  () => [
    props.autoplay,
    props.interval,
    current.value,
    props.loop,
    count.value,
    hovered.value,
    focused.value,
    hidden.value,
    reduced.value,
  ],
  restart,
);
onMounted(() => {
  media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  preference();
  visibility();
  media?.addEventListener('change', preference);
  document.addEventListener('visibilitychange', visibility);
  restart();
});
onBeforeUnmount(() => {
  stop();
  media?.removeEventListener('change', preference);
  document.removeEventListener('visibilitychange', visibility);
});
defineExpose({ prev, next, goTo });
</script>
<template>
  <section
    ref="root"
    class="zt-carousel"
    role="region"
    aria-roledescription="轮播"
    :aria-label="label"
    tabindex="0"
    :style="{ height: typeof height === 'number' ? height + 'px' : height, '--zt-carousel-direction': direction }"
    @keydown="keydown"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focusOut"
    @touchstart.passive="touchStart"
    @touchend.passive="touchEnd"
    @touchcancel="touchX = undefined"
  >
    <div
      class="zt-carousel__slides"
      :aria-live="autoplay && !hovered && !focused && !hidden && !reduced ? 'off' : 'polite'"
    >
      <Transition v-for="(slide, index) in slides()" :key="slide.key ?? index" name="zt-carousel-slide">
      <div
        v-show="index === current"
        class="zt-carousel__slide"
        role="group"
        aria-roledescription="幻灯片"
        :aria-label="`${index + 1} / ${count}`"
        :aria-hidden="index !== current"
        :inert="index !== current || undefined"
      >
        <component :is="slide" />
      </div>
      </Transition>
    </div>
    <template v-if="arrows && count > 1"
      ><button
        type="button"
        class="zt-carousel__arrow zt-carousel__arrow--prev"
        aria-label="上一张"
        :disabled="!loop && current === 0"
        @click="prev"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button
      ><button
        type="button"
        class="zt-carousel__arrow zt-carousel__arrow--next"
        aria-label="下一张"
        :disabled="!loop && current === count - 1"
        @click="next"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
      </button></template
    >
    <div v-if="indicators && count > 1" class="zt-carousel__indicators">
      <button
        v-for="n in count"
        :key="n"
        type="button"
        :aria-label="`切换到第 ${n} 张`"
        :aria-current="current === n - 1 ? 'true' : undefined"
        :class="{ 'is-active': current === n - 1 }"
        @click="goTo(n - 1)"
      />
    </div>
  </section>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-carousel {
  @include glass.tokens;
  position: relative;
  overflow: hidden;
  border-radius: glass.radius(11px);
  color: var(--glass-default-ink);
  background: var(--glass-info-soft);
  touch-action: pan-y;
  &:focus {
    outline: var(--zt-focus-ring-width, 0px) solid var(--glass-accent);
    outline-offset: 3px;
  }
  &__slides { position: relative; height: 100%; isolation: isolate; }
  &__slide { position: absolute; inset: 0; height: 100%; width: 100%; transform: translateX(0); }
  // The incoming slide establishes intrinsic height, while outgoing slides overlap it.
  &__slide[aria-hidden='false'] { position: relative; }
  .zt-carousel-slide-enter-active,
  .zt-carousel-slide-leave-active {
    transition: transform 380ms cubic-bezier(.22, .68, 0, 1);
    will-change: transform;
    pointer-events: none;
  }
  .zt-carousel-slide-enter-from { transform: translateX(calc(var(--zt-carousel-direction) * 100%)); }
  .zt-carousel-slide-leave-to { transform: translateX(calc(var(--zt-carousel-direction) * -100%)); }
  @media (prefers-reduced-motion: reduce) {
    .zt-carousel-slide-enter-active,
    .zt-carousel-slide-leave-active { transition: none; }
  }
  &__slide :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    z-index: 2;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--glass-line);
    border-radius: 50%;
    background: var(--glass-default-soft);
    color: var(--glass-default-ink);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 8px #0000000d;
    transition: background 160ms, box-shadow 160ms;
    svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    &:hover:not(:disabled) { background: var(--glass-info-soft); box-shadow: 0 3px 12px #00000014; }
    cursor: pointer;
    &--prev {
      left: 12px;
    }
    &--next {
      right: 12px;
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
  &__indicators {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2px;
    z-index: 2;
    button {
      position: relative;
      width: 32px;
      height: 24px;
      padding: 0;
      border: 0;
      background: transparent;
      &::after { content: ''; position: absolute; inset: 9px 4px; border-radius: glass.radius(6px); background: var(--glass-default-ink); opacity: .28; transition: opacity 160ms, background 160ms; }
      cursor: pointer;
      &.is-active::after {
        background: var(--glass-accent); opacity: 1;
      }
      &:hover::after { opacity: .7; }
    }
  }
  button:focus {
    outline: var(--zt-focus-ring-width, 0px) solid var(--glass-accent);
    outline-offset: 3px;
  }
}
</style>
