<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  Transition,
} from "vue";
import ZtIcon from "../icon/ZtIcon.vue";
import { useZtConfig } from "../config-provider/context";
import { useOverlay } from "../overlay/useOverlay";
import {
  nextViewerTransform,
  normalizeViewerIndex,
  type ViewerTransform,
} from "./transform";
import type { ZtImageViewerProps } from "./types";
import "./image.scss";

defineOptions({ name: "ZtImageViewer" });
const { style: providerStyle } = useZtConfig();
const props = withDefaults(defineProps<ZtImageViewerProps>(), {
  initialIndex: 0,
  infinite: true,
  zoomRate: 1.2,
  minScale: 0.2,
  maxScale: 7,
  hideOnClickModal: false,
  closeOnPressEscape: true,
  zIndex: 2000,
});
const emit = defineEmits<{ switch: [index: number]; close: [] }>();
const visible = ref(true);
const { panel, layer, isTop } = useOverlay({
  modelValue: visible,
  props: {
    get zIndex() {
      return props.zIndex;
    },
    escClosable: false,
    focusTrap: true,
    lockScroll: true,
  },
  emit() {},
});
const direction = ref(1);
const index = ref(
  normalizeViewerIndex(props.initialIndex, props.urls.length, props.infinite),
);
const transform = ref<ViewerTransform>({ scale: 1, rotate: 0, x: 0, y: 0 });
const current = computed(() => props.urls[index.value]);
const currentAlt = computed(
  () => props.alts?.[index.value] ?? `图片 ${index.value + 1}`,
);
// Keep the decoded image on screen until the requested image is ready.
const loadedUrls = new Set<string>();
const loadingImage = ref(Boolean(current.value));
const failedImage = ref(false);
const displayed = ref(
  current.value
    ? { url: current.value, index: index.value, alt: currentAlt.value }
    : undefined,
);
const preload = computed(
  () =>
    loadingImage.value &&
    current.value &&
    (displayed.value?.url !== current.value ||
      displayed.value?.index !== index.value),
);
function commitImage() {
  if (!current.value) return;
  displayed.value = {
    url: current.value,
    index: index.value,
    alt: currentAlt.value,
  };
  transform.value = nextViewerTransform(transform.value, { type: "reset" });
  loadingImage.value = false;
  failedImage.value = false;
}
function imageLoaded(event: Event) {
  const image = event.target as HTMLImageElement;
  const url = image.getAttribute("src");
  if (url) loadedUrls.add(url);
  if (
    url === current.value &&
    Number(image.dataset.sourceIndex) === index.value &&
    loadingImage.value
  )
    commitImage();
}
function imageFailed(event: Event) {
  const image = event.target as HTMLImageElement;
  if (
    displayed.value?.url === image.getAttribute("src") &&
    displayed.value?.index === Number(image.dataset.sourceIndex)
  )
    displayed.value = undefined;
  if (
    image.getAttribute("src") !== current.value ||
    Number(image.dataset.sourceIndex) !== index.value
  )
    return;
  loadedUrls.delete(current.value!);
  loadingImage.value = false;
  failedImage.value = true;
  displayed.value = undefined;
}
const style = computed(() => ({
  transform: `translate3d(${transform.value.x}px,${transform.value.y}px,0) scale(${transform.value.scale}) rotate(${transform.value.rotate}deg)`,
}));
// Viewer close is synchronous; its owner removes the viewer after this event.
function close() {
  if (!isTop.value || !visible.value) return;
  visible.value = false;
  emit("close");
}
function change(step: number) {
  const next = normalizeViewerIndex(
    index.value + step,
    props.urls.length,
    props.infinite,
  );
  if (next === index.value) return;
  direction.value = step > 0 ? 1 : -1;
  index.value = next;
  emit("switch", next);
}
function alter(type: "zoom" | "rotate", direction: 1 | -1) {
  if (loadingImage.value || failedImage.value || !displayed.value) return;
  transform.value = nextViewerTransform(
    transform.value,
    { type, direction },
    {
      zoomRate: props.zoomRate,
      minScale: props.minScale,
      maxScale: props.maxScale,
    },
  );
}
function key(event: KeyboardEvent) {
  if (
    !isTop.value ||
    !visible.value ||
    event.isComposing ||
    event.defaultPrevented
  )
    return;
  if (event.key === "Escape" && props.closeOnPressEscape) close();
  else if (!current.value) return;
  else if (event.key === "ArrowRight") change(1);
  else if (event.key === "ArrowLeft") change(-1);
  else if (loadingImage.value || failedImage.value) return;
  else if (event.key === "+") alter("zoom", 1);
  else if (event.key === "-") alter("zoom", -1);
  else if (event.key === "0")
    transform.value = nextViewerTransform(transform.value, { type: "reset" });
  else return;
  event.preventDefault();
  event.stopImmediatePropagation();
}
function deactivateFrame(element: Element) {
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("inert", "");
}
function activateFrame(element: Element) {
  element.removeAttribute("aria-hidden");
  element.removeAttribute("inert");
}
watch(
  () => [props.urls.length, props.infinite],
  () => {
    index.value = normalizeViewerIndex(
      index.value,
      props.urls.length,
      props.infinite,
    );
  },
);
watch([index, current], () => {
  failedImage.value = false;
  if (!current.value) {
    displayed.value = undefined;
    loadingImage.value = false;
    transform.value = nextViewerTransform(transform.value, { type: "reset" });
  } else if (loadedUrls.has(current.value)) commitImage();
  else loadingImage.value = true;
});
watch(currentAlt, (alt) => {
  if (
    displayed.value?.url === current.value &&
    displayed.value.index === index.value
  )
    displayed.value.alt = alt;
});
onMounted(() => document.addEventListener("keydown", key, true));
onBeforeUnmount(() => document.removeEventListener("keydown", key, true));
</script>
<template>
  <Teleport to="body">
    <div
      class="zt-image-viewer"
      :style="[
        providerStyle,
        { zIndex: layer, '--zt-image-switch-direction': direction },
      ]"
    >
      <section
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-label="图片预览"
        tabindex="-1"
        @mousedown.self="hideOnClickModal && close()"
      >
        <div class="zt-image-viewer__stage">
          <Transition
            name="zt-image-swap"
            @before-leave="deactivateFrame"
            @before-enter="activateFrame"
          >
            <div
              v-if="displayed"
              :key="`${displayed.index}:${displayed.url}`"
              class="zt-image-viewer__frame"
              :data-image-index="displayed.index"
            >
              <img
                :src="displayed.url"
                :alt="displayed.alt"
                :data-source-index="displayed.index"
                @load="imageLoaded"
                @error="imageFailed"
                :style="style"
                draggable="false"
              />
            </div>
          </Transition>
          <img
            v-if="preload"
            :key="`preload:${index}:${current}`"
            class="zt-image-viewer__preload"
            :src="current"
            :data-source-index="index"
            alt=""
            aria-hidden="true"
            @load="imageLoaded"
            @error="imageFailed"
          />
          <span
            v-if="current && failedImage"
            class="zt-image-viewer__empty"
            role="alert"
            >图片加载失败，请切换其他图片</span
          >
          <span
            v-else-if="loadingImage"
            class="zt-image-viewer__loading"
            role="status"
            >图片加载中…</span
          >
          <span v-if="!current" class="zt-image-viewer__empty"
            >暂无可预览图片</span
          >
        </div>
        <button
          class="zt-image-viewer__close"
          type="button"
          aria-label="关闭预览"
          @click="close"
        >
          <ZtIcon :size="20" name="close" />
        </button>
        <button
          v-if="urls.length > 1"
          class="zt-image-viewer__prev"
          type="button"
          aria-label="上一张"
          :disabled="!infinite && index === 0"
          @click="change(-1)"
        >
          <ZtIcon :size="20" name="chevron-left" />
        </button>
        <button
          v-if="urls.length > 1"
          class="zt-image-viewer__next"
          type="button"
          aria-label="下一张"
          :disabled="!infinite && index === urls.length - 1"
          @click="change(1)"
        >
          <ZtIcon :size="20" name="chevron-right" />
        </button>
        <div
          class="zt-image-viewer__toolbar"
          role="toolbar"
          aria-label="图片操作"
        >
          <button
            type="button"
            aria-label="缩小"
            :disabled="!displayed || loadingImage || failedImage"
            @click="alter('zoom', -1)"
          >
            <ZtIcon :size="20" name="zoom-out" />
          </button>
          <span class="zt-image-viewer__counter" aria-live="polite"
            >{{ urls.length ? index + 1 : 0 }} / {{ urls.length }}</span
          >
          <button
            type="button"
            aria-label="放大"
            :disabled="!displayed || loadingImage || failedImage"
            @click="alter('zoom', 1)"
          >
            <ZtIcon :size="20" name="zoom-in" />
          </button>
          <span class="zt-image-viewer__divider" aria-hidden="true" />
          <button
            class="zt-image-viewer__rotate-left"
            type="button"
            aria-label="向左旋转"
            :disabled="!displayed || loadingImage || failedImage"
            @click="alter('rotate', -1)"
          >
            <ZtIcon :size="20" name="undo" />
          </button>
          <button
            type="button"
            aria-label="重置"
            :disabled="!displayed || loadingImage || failedImage"
            @click="
              transform = nextViewerTransform(transform, { type: 'reset' })
            "
          >
            1:1
          </button>
          <button
            class="zt-image-viewer__rotate-right"
            type="button"
            aria-label="向右旋转"
            :disabled="!displayed || loadingImage || failedImage"
            @click="alter('rotate', 1)"
          >
            <ZtIcon :size="20" name="redo" />
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
