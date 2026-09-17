<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtButton disabled>默认</ZtButton>
    <ZtButton status="primary" disabled>主要</ZtButton>
    <ZtButton status="success" disabled>成功</ZtButton>
    <ZtButton status="danger" disabled>危险</ZtButton>
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
</style>
