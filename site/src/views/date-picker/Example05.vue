<script setup lang="ts">
import { ZtDatePicker } from '@ztechjs/zt-ui';
const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;
</script>

<template>
  <div class="date-demo-stack">
    <ZtDatePicker
      v-for="status in statuses"
      :key="status"
      :status="status"
      model-value="2026-01-01"
      :placeholder="status"
    />
  </div>
</template>

<style scoped>
.date-demo-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
}
.date-demo-stack > span {
  color: #737d8b;
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
