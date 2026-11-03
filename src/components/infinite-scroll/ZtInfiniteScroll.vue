<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick, onMounted } from 'vue';
import { useZtSize } from '../config-provider/context';
import { useScrollTarget, viewport } from '../anchor/scroll';
import type { ZtInfiniteScrollProps, ZtInfiniteScrollEmits } from './types';
const props = withDefaults(defineProps<ZtInfiniteScrollProps>(), {
  distance: 100,
  immediate: true,
  loading: false,
  disabled: false,
  finished: false,
});
const size = useZtSize(props);
const emit = defineEmits<ZtInfiniteScrollEmits>(),
  root = ref<HTMLElement>(),
  pending = ref(false),
  failed = ref(false);
let alive = true,
  controller: AbortController | undefined,
  ready = false;
async function check(force = false) {
  if (
    !alive ||
    pending.value ||
    props.loading ||
    props.disabled ||
    props.finished ||
    (failed.value && !force)
  )
    return;
  if (
    !force &&
    root.value &&
    root.value.getBoundingClientRect().bottom >
      viewport(binding.getTarget()).bottom + props.distance
  )
    return;
  failed.value = false;
  pending.value = true;
  controller = new AbortController();
  emit('load');
  try {
    await props.load?.(controller.signal);
  } catch (error) {
    if (alive && !controller.signal.aborted) {
      failed.value = true;
      emit('error', error);
    }
  } finally {
    if (alive) {
      pending.value = false;
      // One page may not fill the viewport; recheck once after layout settles.
      // Guard against tight loops when load() adds no content.
      const before = root.value?.scrollHeight ?? 0
      void nextTick(() => {
        if (!alive) return
        const after = root.value?.scrollHeight ?? 0
        if (after > before) void check()
      })
    }
  }
}
const binding = useScrollTarget(
  () => props.container,
  () => {
    if (ready) void check();
  },
);
onMounted(() => {
  ready = true;
  if (props.immediate) void check();
});
watch(
  () => [props.loading, props.disabled, props.finished],
  () => {
    if (!props.loading && !props.disabled && !props.finished)
      void nextTick(() => check());
  },
);
watch(size, () => { void nextTick(() => check()); });
onBeforeUnmount(() => {
  alive = false;
  controller?.abort();
});
const retry = () => check(true);
defineExpose({ check: () => check(), retry });
</script>
<template>
  <div ref="root" class="zt-infinite-scroll" :class="`zt-infinite-scroll--${size}`" :aria-busy="pending || loading">
    <slot />
    <div v-if="failed" role="alert" class="zt-infinite-scroll__state">
      <slot name="error" :retry="retry"
        >加载失败 <button class="zt-infinite-scroll__retry" type="button" @click="retry">重试</button></slot
      >
    </div>
    <div
      v-else-if="pending || loading"
      role="status"
      class="zt-infinite-scroll__state"
    >
      <slot name="loading">加载中…</slot>
    </div>
    <div v-else-if="finished" role="status" class="zt-infinite-scroll__state">
      <slot name="finished">没有更多内容了</slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-infinite-scroll {
  @include glass.tokens;
  --zt-infinite-scroll-padding-y: 12px;
  --zt-infinite-scroll-padding-x: 16px;
  color: var(--glass-default-ink);
  border-radius: glass.radius(11px);
  font: var(--glass-size-default) / 1.5 var(--glass-font);
  &--mini { font-size: var(--glass-size-mini); --zt-infinite-scroll-padding-y: 6px; --zt-infinite-scroll-padding-x: 10px; }
  &--small { font-size: var(--glass-size-small); --zt-infinite-scroll-padding-y: 9px; --zt-infinite-scroll-padding-x: 12px; }
  &--medium { font-size: var(--glass-size-medium); --zt-infinite-scroll-padding-y: 14px; --zt-infinite-scroll-padding-x: 18px; }
  &--large { font-size: var(--glass-size-large); --zt-infinite-scroll-padding-y: 16px; --zt-infinite-scroll-padding-x: 20px; }
  &__state {
    text-align: center;
    padding: var(--zt-infinite-scroll-padding-x);
    color: var(--glass-muted);
  }
  &__retry {
    margin-left: 8px;
    background: var(--glass-default-soft);
    border: 1px solid var(--glass-line);
    border-radius: glass.radius(6px);
    color: var(--glass-accent);
    padding: calc(var(--zt-infinite-scroll-padding-y) / 3) var(--zt-infinite-scroll-padding-y);
    font: inherit;
    cursor: pointer;
  }
}
</style>
