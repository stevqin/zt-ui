<script setup lang="ts">
import { ref } from 'vue';
import { ZtDateTimePicker } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue } from '@ztechjs/zt-ui';
const rangeValue = ref<ZtDatePickerValue>(null);
</script>

<template>
  <div class="date-demo-stack">
    <ZtDateTimePicker v-model="rangeValue" range clearable /><span
      >当前范围：{{ rangeValue ?? '未选择' }}</span
    >
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
