<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue';
import { useScrollTarget, viewport } from '../anchor/scroll';
import type { ZtAffixProps, ZtAffixEmits } from './types';
const props = withDefaults(defineProps<ZtAffixProps>(), {
  position: 'top',
  offset: 0,
  zIndex: 100,
  disabled: false,
});
const emit = defineEmits<ZtAffixEmits>(),
  root = ref<HTMLElement>(),
  content = ref<HTMLElement>(),
  fixed = ref(false),
  box = ref({ top: 0, left: 0, width: 0, height: 0 });
function setFixed(value: boolean) {
  if (fixed.value !== value) {
    fixed.value = value;
    emit('change', value);
  }
}
const binding = useScrollTarget(
  () => props.container,
  (target) => {
    if (!root.value || !content.value) return;
    const rect = root.value.getBoundingClientRect(),
      inner = content.value.getBoundingClientRect(),
      view = viewport(target),
      height = inner.height;
    const top =
      props.position === 'top'
        ? Math.min(view.top + props.offset, view.bottom - height)
        : Math.max(view.top, view.bottom - props.offset - height);
    const shouldFix =
      !props.disabled &&
      (props.position === 'top'
        ? rect.top < view.top + props.offset && view.bottom > 0
        : rect.top + height > view.bottom - props.offset &&
          view.top < window.innerHeight);
    box.value = { top, left: rect.left, width: rect.width, height };
    setFixed(shouldFix);
  },
);
const style = computed(() =>
  fixed.value
    ? {
        position: 'fixed' as const,
        top: box.value.top + 'px',
        left: box.value.left + 'px',
        width: box.value.width + 'px',
        zIndex: props.zIndex,
      }
    : undefined,
);
let observer: ResizeObserver | undefined;
onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(binding.update);
    if (root.value) observer.observe(root.value);
    if (content.value) observer.observe(content.value);
  }
});
watch(
  () => [props.offset, props.position, props.disabled],
  () => void nextTick(binding.update),
);
onBeforeUnmount(() => observer?.disconnect());
defineExpose({ update: binding.update });
</script>
<template>
  <div
    ref="root"
    class="zt-affix"
    :style="fixed ? { height: box.height + 'px' } : undefined"
  >
    <div
      ref="content"
      class="zt-affix__content"
      :class="{ 'is-fixed': fixed }"
      :style="style"
    >
      <slot :fixed="fixed" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.zt-affix {
  min-width: 0;
}
.zt-affix__content {
  box-sizing: border-box;
}
</style>
