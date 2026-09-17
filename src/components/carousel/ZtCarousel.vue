<script setup lang="ts">
import {
  ref,
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
  count.value = nodes.length;
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
function goTo(index: number) {
  if (count.value < 2 || !Number.isFinite(index)) return;
  index = Math.floor(index);
  const next = props.loop
    ? ((index % count.value) + count.value) % count.value
    : Math.max(0, Math.min(count.value - 1, index));
  if (next !== current.value) {
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
    event.target.closest('input,textarea,select,[contenteditable="true"]')
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
  timer: ReturnType<typeof setInterval> | undefined,
  media: MediaQueryList | undefined;
function touchStart(event: TouchEvent) {
  touchX = event.touches[0]?.clientX;
}
function touchEnd(event: TouchEvent) {
  const end = event.changedTouches[0]?.clientX;
  if (touchX !== undefined && end !== undefined && Math.abs(end - touchX) >= 40)
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
    props.modelValue,
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
    class="zt-carousel"
    role="region"
    aria-roledescription="轮播"
    :aria-label="label"
    tabindex="0"
    :style="{ height: typeof height === 'number' ? height + 'px' : height }"
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
      :aria-live="autoplay && !hovered && !focused ? 'off' : 'polite'"
    >
      <div
        v-for="(slide, index) in slides()"
        v-show="index === current"
        :key="slide.key ?? index"
        class="zt-carousel__slide"
        role="group"
        aria-roledescription="幻灯片"
        :aria-label="`${index + 1} / ${count}`"
        :aria-hidden="index !== current"
        :inert="index !== current || undefined"
      >
        <component :is="slide" />
      </div>
    </div>
    <template v-if="arrows && count > 1"
      ><button
        type="button"
        class="zt-carousel__arrow zt-carousel__arrow--prev"
        aria-label="上一张"
        :disabled="!loop && current === 0"
        @click="prev"
      >
        ‹</button
      ><button
        type="button"
        class="zt-carousel__arrow zt-carousel__arrow--next"
        aria-label="下一张"
        :disabled="!loop && current === count - 1"
        @click="next"
      >
        ›
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
  &:focus-visible {
    outline: 2px solid var(--glass-accent);
    outline-offset: 3px;
  }
  &__slides,
  &__slide {
    height: 100%;
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
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 50%;
    background: var(--glass-default-soft);
    color: var(--glass-default-ink);
    font-size: 26px;
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
    gap: 8px;
    button {
      width: 24px;
      height: 8px;
      padding: 0;
      border: 1px solid var(--glass-line);
      border-radius: glass.radius(6px);
      background: var(--glass-default-soft);
      cursor: pointer;
      &.is-active {
        background: var(--glass-accent);
      }
    }
  }
  button:focus-visible {
    outline: 2px solid var(--glass-accent);
    outline-offset: 3px;
  }
}
</style>
