<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtDrawer } from '@ztechjs/zt-ui';
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
  <div class="demo-row"><ZtButton @click="footerVisible = true">编辑筛选</ZtButton></div>
  <ZtDrawer
    v-model="footerVisible"
    title="编辑筛选"
    :size="520"
    show-footer
    mask-closable
    :confirm-loading="saving"
    @confirm="save"
    ><div class="drawer-form">
      <label
        >品牌<select>
          <option>全部品牌</option>
          <option>玖姿</option>
          <option>尹默</option>
        </select></label
      ><label
        >状态<select>
          <option>全部状态</option>
          <option>在售</option>
          <option>停售</option>
        </select></label
      >
    </div></ZtDrawer
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
