<script setup lang="ts">
import { ref } from 'vue';
import { ZtInfiniteScroll } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  items = ref<number[]>([]);
async function load(signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new Error('已取消'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, 350);
    signal.addEventListener('abort', abort, { once: true });
  });
  if (!signal.aborted)
    items.value.push(
      ...Array.from({ length: 6 }, (_, i) => items.value.length + i + 1),
    );
}
</script>
<template>
  <div ref="panel" class="panel">
    <ZtInfiniteScroll
      :container="() => panel"
      :load="load"
      :distance="60"
      :finished="items.length >= 30"
      ><div v-for="n in items" :key="n" class="row">
        本地模拟记录 {{ n }}
      </div></ZtInfiniteScroll
    >
  </div>
</template>
<style scoped>
.panel {
  height: 260px;
  overflow: auto;
  border: 1px solid #8a9ab044;
  border-radius: 8px;
}
.row {
  padding: 20px;
  border-bottom: 1px solid #8a9ab022;
}
</style>
