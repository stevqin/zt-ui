<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtDrawer, type ZtDrawerPlacement } from '@ztechjs/zt-ui';
const placementVisible = ref(false);
const placement = ref<ZtDrawerPlacement>('right');
function openAt(value: ZtDrawerPlacement) {
  placement.value = value;
  placementVisible.value = true;
}
</script>

<template>
  <div class="demo-row">
    <ZtButton @click="openAt('left')">左侧</ZtButton
    ><ZtButton @click="openAt('right')">右侧</ZtButton
    ><ZtButton @click="openAt('top')">顶部</ZtButton
    ><ZtButton @click="openAt('bottom')">底部</ZtButton>
  </div>
  <ZtDrawer v-model="placementVisible" title="方向示例" :placement="placement" :size="320"
    ><p>当前方向：{{ placement }}</p></ZtDrawer
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
