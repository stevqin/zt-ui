<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtButton>默认按钮</ZtButton>
    <ZtButton status="primary">主要按钮</ZtButton>
    <ZtButton status="success">成功按钮</ZtButton>
    <ZtButton status="warning">警告按钮</ZtButton>
    <ZtButton status="danger">危险按钮</ZtButton>
    <ZtButton status="info">信息按钮</ZtButton>
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
