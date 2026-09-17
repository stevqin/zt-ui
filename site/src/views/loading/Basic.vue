<script setup lang="ts">
import { ref } from 'vue';
import { ZtLoading, ZtSwitch } from '@ztechjs/zt-ui';
const loading = ref(true);
</script>
<template>
  <div class="demo-stack">
    <ZtSwitch v-model="loading" active-text="加载中" /><ZtLoading
      :loading="loading"
      text="正在加载订单"
      ><div class="area">订单内容区域</div></ZtLoading
    >
  </div>
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
.area {
  min-height: 150px;
  padding: 24px;
  border: 1px solid var(--zt-line, #ddd);
  border-radius: var(--zt-radius, 11px);
}
</style>
