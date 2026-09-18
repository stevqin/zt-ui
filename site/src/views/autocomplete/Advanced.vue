<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtAutocomplete, type ZtAutocompleteSource } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref('');
const fetch: ZtAutocompleteSource = (query, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => {
        if (query === 'error') reject(new Error('模拟失败，请修改输入重试'));
        else
          resolve(
            ['Alice', 'Alex', 'Bob', 'Carol']
              .filter((x) => x.toLowerCase().includes(query.toLowerCase()))
              .map((value) => ({ value })),
          );
      },
      query.length === 1 ? 800 : 200,
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
    <ZtAutocomplete
      :status="demoStatus"
      v-model="value"
      :fetch-suggestions="fetch"
      :debounce="100"
      clearable
      aria-label="异步成员"
    />
    <p>
      快速输入 a、al 验证旧请求取消；输入 error
      查看失败反馈。示例只使用本地计时器。
    </p>
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
