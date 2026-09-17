<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtDrawer } from '@ztechjs/zt-ui';
const basicVisible = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtButton status="primary" @click="basicVisible = true">打开抽屉</ZtButton>
  </div>
  <ZtDrawer v-model="basicVisible" title="筛选条件"
    ><p>这里可以放筛选项、详情或其他辅助内容。</p></ZtDrawer
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

.drawer-form {
  display: grid;
  gap: 16px;
}
.drawer-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.drawer-form select {
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  background: #fff;
  font: inherit;
}
</style>
