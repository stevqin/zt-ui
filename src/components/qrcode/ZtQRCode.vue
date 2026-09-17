<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { encodeQRCode } from './encode';
import type { ZtQRCodeProps, ZtQRCodeEmits } from './types';
const props = withDefaults(defineProps<ZtQRCodeProps>(), {
  value: '',
  level: 'M',
  size: 160,
  margin: 4,
  renderAs: 'svg',
  color: '#000000',
  background: '#ffffff',
  label: '二维码',
});
const emit = defineEmits<ZtQRCodeEmits>(),
  svg = ref<SVGSVGElement>(),
  canvas = ref<HTMLCanvasElement>(),
  renderError = ref(false);
const size = computed(() =>
    Math.max(
      16,
      Math.min(4096, Number.isFinite(props.size) ? props.size : 160),
    ),
  ),
  margin = computed(() =>
    Math.max(
      0,
      Math.min(
        100,
        Math.floor(Number.isFinite(props.margin) ? props.margin : 4),
      ),
    ),
  );
const result = computed(() => {
  if (!props.value) return { matrix: null, error: null };
  try {
    return { matrix: encodeQRCode(props.value, props.level), error: null };
  } catch (error) {
    return { matrix: null, error };
  }
});
const extent = computed(
  () => (result.value.matrix?.size ?? 0) + margin.value * 2,
);
const path = computed(() => {
  const matrix = result.value.matrix;
  if (!matrix) return '';
  let data = '';
  for (let y = 0; y < matrix.size; y++)
    for (let x = 0; x < matrix.size; x++)
      if (matrix.data[y * matrix.size + x])
        data += `M${x + margin.value} ${y + margin.value}h1v1h-1z`;
  return data;
});
function draw() {
  renderError.value = false;
  if (props.renderAs !== 'canvas' || !canvas.value || !result.value.matrix)
    return;
  try {
    const context = canvas.value.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    const matrix = result.value.matrix,
      scale = size.value / extent.value;
    context.fillStyle = props.background;
    context.fillRect(0, 0, size.value, size.value);
    context.fillStyle = props.color;
    for (let y = 0; y < matrix.size; y++)
      for (let x = 0; x < matrix.size; x++)
        if (matrix.data[y * matrix.size + x]) {
          const left = Math.floor((x + margin.value) * scale),
            top = Math.floor((y + margin.value) * scale);
          context.fillRect(
            left,
            top,
            Math.ceil((x + margin.value + 1) * scale) - left,
            Math.ceil((y + margin.value + 1) * scale) - top,
          );
        }
  } catch (error) {
    renderError.value = true;
    emit('error', error);
  }
}
watch(
  () => result.value.error,
  (error) => {
    if (error) emit('error', error);
  },
  { immediate: true },
);
watch(
  () => [
    result.value,
    props.renderAs,
    props.color,
    props.background,
    size.value,
    margin.value,
  ],
  () => {
    renderError.value = false;
    void nextTick(draw);
  },
);
onMounted(draw);
const downloadTimers = new Map<ReturnType<typeof setTimeout>, string>();
onBeforeUnmount(() => {
  for (const [timer, url] of downloadTimers) {
    clearTimeout(timer);
    URL.revokeObjectURL(url);
  }
  downloadTimers.clear();
});
function download(filename = 'qrcode') {
  if (!result.value.matrix || renderError.value) return false;
  let objectUrl: string | undefined;
  try {
    let url: string, extension: string;
    if (props.renderAs === 'svg' && svg.value) {
      objectUrl = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(svg.value)], {
          type: 'image/svg+xml;charset=utf-8',
        }),
      );
      url = objectUrl;
      extension = 'svg';
    } else if (canvas.value) {
      url = canvas.value.toDataURL('image/png');
      extension = 'png';
    } else return false;
    const name = filename.replace(/\.(svg|png)$/i, '') + '.' + extension,
      link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    emit('download', name);
    return true;
  } catch (error) {
    emit('error', error);
    return false;
  } finally {
    if (objectUrl) {
      const url = objectUrl;
      const timer = setTimeout(() => {
        URL.revokeObjectURL(url);
        downloadTimers.delete(timer);
      }, 0);
      downloadTimers.set(timer, url);
    }
  }
}
defineExpose({ download });
</script>
<template>
  <div class="zt-qrcode">
    <div v-if="!value" role="status" class="zt-qrcode__state">暂无内容</div>
    <div
      v-else-if="result.error || renderError"
      role="alert"
      class="zt-qrcode__state"
    >
      二维码编码失败
    </div>
    <svg
      v-else-if="renderAs === 'svg'"
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${extent} ${extent}`"
      role="img"
      :aria-label="label"
      shape-rendering="crispEdges"
    >
      <rect :width="extent" :height="extent" :fill="background" />
      <path :d="path" :fill="color" /></svg
    ><canvas
      v-else
      ref="canvas"
      :width="size"
      :height="size"
      role="img"
      :aria-label="label"
      >{{ label }}</canvas
    >
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-qrcode {
  @include glass.tokens;
  display: inline-flex;
  max-width: 100%;
  color: var(--glass-default-ink);
  font-family: var(--glass-font);
  svg,
  canvas {
    max-width: 100%;
    height: auto;
  }
  &__state {
    border: 1px dashed var(--glass-line);
    border-radius: glass.radius(8px);
    padding: 24px;
    color: var(--glass-muted);
  }
}
</style>
