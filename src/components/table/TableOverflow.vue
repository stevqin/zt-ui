<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUpdated } from 'vue';
import ZtTooltip from '../tooltip/ZtTooltip.vue';
defineOptions({ name: 'ZtTableOverflow' });
const content = ref<HTMLElement>();
const overflowing = ref(false);
const text = ref('');
let observer: ResizeObserver | undefined;
function measure() {
  const el = content.value;
  overflowing.value = !!el && el.scrollWidth > el.clientWidth;
  text.value = el?.textContent ?? '';
}
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure);
    if (content.value) observer.observe(content.value);
  }
});
onUpdated(measure);
onBeforeUnmount(() => observer?.disconnect());
</script>
<template>
  <ZtTooltip :disabled="!overflowing" :content="text">
    <span ref="content" class="zt-table__overflow"><slot /></span>
  </ZtTooltip>
</template>
