<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { ZtDatePicker } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
</script>

<template>
  <div class="date-demo-stack">
    <ZtDatePicker
      :status="demoStatus"
      model-value="2026-01-01"
      :placeholder="demoStatus"
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
