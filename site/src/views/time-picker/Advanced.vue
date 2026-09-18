<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtTimePicker, type ZtTimePickerValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref<ZtTimePickerValue>(['09:00', '18:00']);
const disabledTime = (time: string) => time < '08:00' || time > '20:00';
</script>
<template>
  <div class="picker-demo">
    <ZtTimePicker
      :status="demoStatus"
      v-model="value"
      range
      :minute-step="15"
      :disabled-time="disabledTime"
      clearable
      aria-label="营业时间范围"
    />
    <p>
      08:00 前、20:00 后不可选。结束早于开始时禁止确认。当前：{{
        JSON.stringify(value)
      }}
    </p>
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
