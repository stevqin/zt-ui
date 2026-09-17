<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal } from '@ztechjs/zt-ui';
const maskVisible = ref(false);
async function guardClose() {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return true;
}
</script>

<template>
  <div class="demo-row"><ZtButton @click="maskVisible = true">测试关闭行为</ZtButton></div>
  <ZtModal v-model="maskVisible" title="关闭行为" mask-closable :before-close="guardClose"
    ><p>点击遮罩、关闭按钮或按 Escape，组件会等待异步拦截完成。</p></ZtModal
  >
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}

.overlay-demo-form {
  display: grid;
  gap: 14px;
}
.overlay-demo-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.overlay-demo-form input {
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  font: inherit;
}
.demo-state {
  color: #64748b;
  font-size: 13px;
}
</style>
