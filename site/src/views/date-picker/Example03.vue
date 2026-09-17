<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePicker } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue } from '@ztechjs/zt-ui';
const limited = ref<ZtDatePickerValue>(null);
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
</script>

<template>
  <div class="date-demo-stack">
    <ZtDatePicker v-model="limited" :disabled-date="disabledDate" /><ZtDatePicker
      model-value="2026-09-16"
      disabled
    /><ZtDatePicker model-value="2026-09-16" readonly />
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
