<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal } from '@ztechjs/zt-ui';
const basicVisible = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtButton status="primary" @click="basicVisible = true">打开弹窗</ZtButton>
  </div>
  <ZtModal v-model="basicVisible" title="基础弹窗"
    ><p>这里是弹窗正文，可放置表单、提示或详情内容。</p></ZtModal
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
