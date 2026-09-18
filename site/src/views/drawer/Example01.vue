<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtDrawer, ZtConfigProvider, ZtInput } from '@ztechjs/zt-ui';
const basicVisible = ref(false);
</script>

<template>
  <ZtConfigProvider size="large">
    <div class="demo-row">
      <ZtButton status="primary" @click="basicVisible = true"
        >打开抽屉</ZtButton
      >
    </div>
    <ZtDrawer v-model="basicVisible" title="筛选条件" :width="420"
      ><p>继承全局 large 密度。</p>
      <ZtInput aria-label="筛选关键词" placeholder="此输入自动继承 large"
    /></ZtDrawer>
  </ZtConfigProvider>
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
