<script setup lang="ts">
import { computed } from 'vue';
import ZtSkeletonItem from './ZtSkeletonItem.vue';
import type { ZtSkeletonProps } from './types';
const props = withDefaults(defineProps<ZtSkeletonProps>(), {
  loading: true,
  animated: true,
  rows: 3,
});
const count = computed(() =>
  Number.isFinite(props.rows)
    ? Math.min(100, Math.max(0, Math.floor(props.rows)))
    : 3,
);
</script>
<template>
  <div
    v-if="loading"
    class="zt-skeleton"
    role="status"
    aria-label="加载中"
    aria-busy="true"
  >
    <slot name="template"
      ><ZtSkeletonItem
        v-for="i in count"
        :key="i"
        :animated="animated"
        :width="widths?.[i - 1] ?? (i === count ? '60%' : '100%')"
    /></slot>
  </div>
  <slot v-else />
</template>
<style scoped lang="scss">
.zt-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
