<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtDatePickerPanel, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
const value = ref<ZtDatePickerValue>(['2026-09-17', '2026-09-20']);
const disabledDate = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
</script>
<template>
  <div class="picker-demo">
    <ZtDatePickerPanel
      :status="demoStatus"
      v-model="value"
      range
      :disabled-date="disabledDate"
    />
    <p>周末不可选；反向选择自动排列起止。窄屏显示明确的开始/结束提示。</p>
    <p>{{ JSON.stringify(value) }}</p>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
