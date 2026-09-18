<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtDrawer,
  ZtConfigProvider,
  ZtInput,
  ZtSelect,
} from '@ztechjs/zt-ui';
const footerVisible = ref(false);
const saving = ref(false);
function save() {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    footerVisible.value = false;
  }, 1200);
}
</script>

<template>
  <ZtConfigProvider size="large">
    <div class="demo-row">
      <ZtButton @click="footerVisible = true">编辑筛选</ZtButton>
    </div>
    <ZtDrawer
      v-model="footerVisible"
      title="编辑筛选"
      :width="520"
      size="small"
      show-footer
      mask-closable
      :confirm-loading="saving"
      @confirm="save"
      ><div class="drawer-form">
        <ZtInput aria-label="筛选名称" placeholder="继承抽屉 small 密度" />
        <ZtSelect
          aria-label="品牌"
          :options="[
            { value: 'all', label: '全部品牌' },
            { value: 'jz', label: '玖姿' },
          ]"
        />
        <ZtInput
          size="large"
          aria-label="单独设置密度"
          placeholder="显式 large 优先"
        /></div
    ></ZtDrawer>
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
