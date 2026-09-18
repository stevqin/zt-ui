<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtDateTimePicker, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue, ZtDatePickerHoliday } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
const value = ref<ZtDatePickerValue>(null);
const holidayValue = ref<ZtDatePickerValue>('2026-01-01 09:00:00');
const showHolidays = ref(true);
const holidays: ZtDatePickerHoliday[] = [
  { key: '2026-01-01', value: '元旦' },
  { key: '2026-01-15', value: '公司纪念日（示例）' },
];
</script>

<template>
  <div class="date-demo-stack">
    <ZtSwitch
      v-model="showHolidays"
      active-text="标识节假日"
    /><ZtDateTimePicker
      v-model="holidayValue"
      :holidays="holidays"
      :show-holidays="showHolidays"
      :status="demoStatus"
      clearable
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
