<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePicker, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const months = ref<ZtDatePickerValue>(['2026-01', '2026-06']);
const years = ref<ZtDatePickerValue>(['2024', '2026']);
</script>

<template>
  <div class="demo">
    <label>统计月份范围</label>
    <ZtDatePicker v-model="months" type="monthrange" clearable />
    <p>{{ months }}</p>
    <label>财务年度范围</label>
    <ZtDatePicker v-model="years" type="yearrange" clearable />
    <p>{{ years }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
}
p {
  margin: 0;
}
</style>
