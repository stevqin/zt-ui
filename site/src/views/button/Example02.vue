<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtButton size="mini" status="primary">Mini</ZtButton>
    <ZtButton size="small" status="primary">Small</ZtButton>
    <ZtButton status="primary">Default</ZtButton>
    <ZtButton size="medium" status="primary">Medium</ZtButton>
    <ZtButton size="large" status="primary">Large</ZtButton>
  </div>
  <div class="demo-row">
    <ZtButton size="mini">Mini</ZtButton>
    <ZtButton size="small">Small</ZtButton>
    <ZtButton>Default</ZtButton>
    <ZtButton size="medium">Medium</ZtButton>
    <ZtButton size="large">Large</ZtButton>
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
