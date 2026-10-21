<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal } from '@ztechjs/zt-ui';
const maskVisible = ref(false);
const guardedVisible = ref(false);
const checking = ref(false);
async function guardClose() {
  checking.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return true;
  } finally {
    checking.value = false;
  }
}
</script>

<template>
  <div class="demo-row">
    <ZtButton @click="maskVisible = true">点击遮罩关闭</ZtButton>
    <ZtButton @click="guardedVisible = true">异步关闭校验（350ms）</ZtButton>
  </div>
  <ZtModal v-model="maskVisible" title="点击遮罩关闭" mask-closable>
    <p>点击遮罩、关闭按钮或按 Escape，立即开始退场动画。</p>
  </ZtModal>
  <ZtModal v-model="guardedVisible" title="异步关闭校验" mask-closable :before-close="guardClose">
    <p v-if="checking" role="status" aria-live="polite">正在校验，请稍候…</p>
    <p v-else>此示例刻意模拟 350ms 异步校验，校验通过后再关闭。</p>
  </ZtModal>
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
