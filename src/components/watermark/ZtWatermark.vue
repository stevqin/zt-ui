<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import type { ZtWatermarkProps, ZtWatermarkEmits } from './types';
const props = withDefaults(defineProps<ZtWatermarkProps>(), {
  content: '内部资料',
  width: 140,
  height: 64,
  gap: () => [80, 80],
  rotate: -22,
  opacity: 0.15,
  fontSize: 14,
  zIndex: 9,
});
const emit = defineEmits<ZtWatermarkEmits>(),
  root = ref<HTMLElement>(),
  bounds = ref({ width: 600, height: 400 }),
  imageFailed = ref(false);
const lines = computed(() =>
  Array.isArray(props.content) ? props.content : props.content.split('\n'),
);
const tileWidth = computed(() =>
    Math.max(1, props.width + Math.max(0, props.gap[0])),
  ),
  tileHeight = computed(() =>
    Math.max(1, props.height + Math.max(0, props.gap[1])),
  );
const columns = computed(() =>
    Math.max(1, Math.ceil(bounds.value.width / tileWidth.value) + 1),
  ),
  count = computed(() =>
    Math.min(
      1000,
      columns.value * (Math.ceil(bounds.value.height / tileHeight.value) + 1),
    ),
  );
let observer: ResizeObserver | undefined;
function update() {
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    bounds.value = { width: rect.width, height: rect.height };
  }
}
onMounted(() => {
  update();
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(update);
    if (root.value) observer.observe(root.value);
  }
  window.addEventListener('resize', update);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('resize', update);
});
watch(
  () => props.image,
  () => (imageFailed.value = false),
);
function imageError(event: Event) {
  if (!imageFailed.value) {
    imageFailed.value = true;
    emit('error', event);
  }
}
</script>
<template>
  <div ref="root" class="zt-watermark">
    <slot />
    <div
      class="zt-watermark__layer"
      aria-hidden="true"
      :style="{
        opacity: Math.max(0, Math.min(1, opacity)),
        color: color,
        zIndex,
        gridTemplateColumns: `repeat(${columns}, ${tileWidth}px)`,
        gridAutoRows: tileHeight + 'px',
      }"
    >
      <div v-for="n in count" :key="n" class="zt-watermark__tile">
        <div
          :style="{
            width: width + 'px',
            height: height + 'px',
            transform: `rotate(${rotate}deg)`,
            fontSize: fontSize + 'px',
          }"
        >
          <img
            v-if="image && !imageFailed"
            :src="image"
            alt=""
            @error="imageError"
          /><template v-else
            ><div v-for="(line, index) in lines" :key="index">
              {{ line }}
            </div></template
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-watermark {
  @include glass.tokens;
  position: relative;
  isolation: isolate;
  color: var(--glass-default-ink);
  &__layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    display: grid;
    pointer-events: none;
    user-select: none;
    font-family: var(--glass-font);
  }
  &__tile {
    display: grid;
    place-items: center;
    overflow: visible;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
