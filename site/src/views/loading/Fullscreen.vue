<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { ZtButton, useZtLoading } from '@ztechjs/zt-ui';
const loading = useZtLoading();
let timer: ReturnType<typeof setTimeout> | undefined;
function open() {
  const instance = loading({ text: '处理中，1.2秒后完成', lock: true });
  timer = setTimeout(instance.close, 1200);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <ZtButton @click="open">展示全屏加载</ZtButton>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
