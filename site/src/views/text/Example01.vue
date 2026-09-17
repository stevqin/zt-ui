<script setup lang="ts">
import { ZtText } from '@ztechjs/zt-ui';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
const statuses: ZtTextStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
</script>

<template>
  <div class="text-row">
    <ZtText v-for="status in statuses" :key="status" :status="status">{{ status }} 文本</ZtText>
  </div>
</template>

<style scoped>
.text-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.text-limit {
  display: grid;
  gap: 18px;
  width: min(360px, 100%);
}
</style>
