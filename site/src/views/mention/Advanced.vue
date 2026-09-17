<script setup lang="ts">
import { ref } from 'vue';
import { ZtMention, type ZtMentionSource } from '@ztechjs/zt-ui';
const value = ref('');
const fetch: ZtMentionSource = (query, prefix, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(
          (prefix === '#' ? ['设计', '生产', '物流'] : ['alice', 'alex', 'bob'])
            .filter((v) => v.includes(query))
            .map((value) => ({ value })),
        ),
      300,
    );
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('已取消', 'AbortError'));
      },
      { once: true },
    );
  });
</script>
<template>
  <div class="entry-demo">
    <ZtMention
      v-model="value"
      :prefixes="['@', '#']"
      :fetch-suggestions="fetch"
      aria-label="异步提及"
    />
    <p>@ 查询成员，# 查询主题。本地模拟数据，旧请求和卸载时均取消计时器。</p>
  </div>
</template>
<style scoped>
.entry-demo {
  display: grid;
  gap: 14px;
  width: min(100%, 480px);
}
p {
  margin: 0;
  color: var(--zt-text-secondary, #667085);
  font-size: 13px;
}
pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
