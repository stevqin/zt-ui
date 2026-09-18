<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtDatePicker } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
const year = ref<ZtDatePickerValue>('2026');
const month = ref<ZtDatePickerValue>('2026-09');
const years = ref<ZtDatePickerValue>(['2024', '2026']);
const months = ref<ZtDatePickerValue>(['2026-03', '2026-09']);
</script>
<template>
  <div class="period-examples">
    <label
      >年份<ZtDatePicker
        :status="demoStatus"
        v-model="year"
        type="year"
        clearable
    /></label>
    <label
      >月份<ZtDatePicker
        :status="demoStatus"
        v-model="month"
        type="month"
        clearable
    /></label>
    <label
      >年份范围<ZtDatePicker
        :status="demoStatus"
        v-model="years"
        type="yearrange"
        clearable
    /></label>
    <label
      >月份范围<ZtDatePicker
        :status="demoStatus"
        v-model="months"
        type="monthrange"
        clearable
    /></label>
  </div>
</template>
<style scoped>
.period-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.period-examples label {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
</style>
