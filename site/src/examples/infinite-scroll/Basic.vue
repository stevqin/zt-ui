<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtInfiniteScroll } from '@ztechjs/zt-ui';
const container = ref<HTMLElement>(),
  items = ref([1, 2, 3, 4, 5]);
async function load(signal: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (signal.aborted) return;
  const start = items.value.length;
  items.value.push(
    ...Array.from({ length: Math.min(5, 20 - start) }, (_, index) => start + index + 1),
  );
}
</script>
<template>
  <div ref="container" style="height: 260px; overflow: auto; border: 1px solid #8884">
    <ZtInfiniteScroll
      :container="() => container"
      :load="load"
      :finished="items.length >= 20"
      :distance="50"
    >
      <p
        v-for="item in items"
        :key="item"
        style="padding: 12px; border-bottom: 1px solid #8883"
      >
        库存变更记录 {{ item }}
      </p>
      <template #finished>全部 20 条记录已加载</template>
    </ZtInfiniteScroll>
  </div>
</template>
