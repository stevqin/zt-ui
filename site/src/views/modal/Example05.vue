<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal, type ZtComponentSize } from '@ztechjs/zt-ui';
const sizeVisible = ref(false);
const modalSize = ref<ZtComponentSize>('default');
const modalSizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large'];
function openSize(size: ZtComponentSize) {
  modalSize.value = size;
  sizeVisible.value = true;
}
</script>

<template>
  <div class="demo-row">
    <ZtButton v-for="size in modalSizes" :key="size" :size="size" @click="openSize(size)">{{
      size
    }}</ZtButton>
  </div>
  <ZtModal v-model="sizeVisible" :size="modalSize" title="尺寸示例" show-footer
    ><p>当前尺寸：{{ modalSize }}</p></ZtModal
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
