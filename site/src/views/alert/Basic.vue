<script setup lang="ts">
import { ZtAlert } from '@ztechjs/zt-ui';
import type { ZtAlertStatus } from '@ztechjs/zt-ui';
const statuses: ZtAlertStatus[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];
</script>
<template>
  <div class="demo-stack">
    <ZtAlert
      v-for="status in statuses"
      :key="status"
      :status="status"
      :title="status + ' 提示'"
      description="包含说明文字的页面内提示，可以单独关闭。"
    />
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
</style>
