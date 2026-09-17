<script setup lang="ts">
import { ref } from 'vue';
import { ZtInfiniteScroll, ZtButton } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  attempt = ref(0),
  items = ref<number[]>([]),
  disabled = ref(false);
async function load(signal: AbortSignal) {
  attempt.value++;
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new Error('已取消'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, 250);
    signal.addEventListener('abort', abort, { once: true });
  });
  if (signal.aborted) return;
  if (attempt.value === 1) throw new Error('模拟网络错误');
  items.value.push(
    ...Array.from({ length: 5 }, (_, i) => items.value.length + i + 1),
  );
}
</script>
<template>
  <div>
    <ZtButton @click="disabled = !disabled">{{
      disabled ? '恢复自动加载' : '暂停自动加载'
    }}</ZtButton>
    <div ref="panel" class="panel">
      <ZtInfiniteScroll
        :container="() => panel"
        :load="load"
        :disabled="disabled"
        :finished="items.length >= 15"
        ><div v-for="n in items" :key="n" class="row">
          重试后加载的记录 {{ n }}
        </div>
        <template #error="{ retry }"
          >本地模拟请求失败。<ZtButton :disabled="disabled" @click="retry"
            >重新尝试</ZtButton
          ></template
        ><template #finished>全部 15 条已展示</template></ZtInfiniteScroll
      >
    </div>
  </div>
</template>
<style scoped>
.panel {
  height: 220px;
  overflow: auto;
  border: 1px solid #8a9ab044;
  margin-top: 12px;
}
.row {
  padding: 18px;
  border-bottom: 1px solid #8a9ab022;
}
</style>
