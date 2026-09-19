<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtDateTimePicker, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
const rangeValue = ref<ZtDatePickerValue>(null);
const singlePanel = ref(false);
</script>

<template>
  <div class="date-demo-stack">
    <ZtSwitch v-model="singlePanel" active-text="单面板" inactive-text="双面板" />
    <ZtDateTimePicker
      :status="demoStatus"
      v-model="rangeValue"
      range
      :range-panel-mode="singlePanel ? 'single' : 'double'"
      clearable
    /><span>当前范围：{{ rangeValue ?? '未选择' }}</span>
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
