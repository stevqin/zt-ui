<script setup lang="ts">
import { ZtInputNumber } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="number-demo-row">
    <ZtInputNumber :model-value="8" disabled /><ZtInputNumber :model-value="8" readonly />
  </div>
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
.number-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.number-demo-row > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
