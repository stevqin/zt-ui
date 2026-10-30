<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtInfiniteScroll, ZtButton } from '@ztechjs/zt-ui';
import type { ZtInfiniteScrollInstance } from '@ztechjs/zt-ui';
const list = ref<ZtInfiniteScrollInstance>(),
  items = ref([1, 2, 3]);
let first = true;
async function load(signal: AbortSignal) {
  if (first) {
    first = false;
    throw new Error('模拟网络中断');
  }
  if (!signal.aborted) items.value.push(4, 5, 6);
}
</script>
<template>
  <ZtButton @click="list?.retry()">请求下一页</ZtButton>
  <ZtInfiniteScroll
    ref="list"
    :load="load"
    :immediate="false"
    :finished="items.length >= 6"
  >
    <p v-for="item in items" :key="item">到货通知 {{ item }}</p>
    <template #error="{ retry }">
      <span>模拟网络中断</span>
      <ZtButton @click="retry">重试</ZtButton>
    </template>
    <template #finished>全部通知已加载</template>
  </ZtInfiniteScroll>
</template>
