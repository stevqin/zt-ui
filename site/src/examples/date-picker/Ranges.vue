<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePicker, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const range = ref<ZtDatePickerValue>(null);
const month = ref<ZtDatePickerValue>('2026-10');
const year = ref<ZtDatePickerValue>('2026');
</script>

<template>
  <div class="demo">
    <ZtDatePicker
      v-model="range"
      type="daterange"
      range-panel-mode="double"
      :shortcuts="[{ label: '十月', value: ['2026-10-01', '2026-10-31'] }]"
    />
    <ZtDatePicker v-model="month" type="month" />
    <ZtDatePicker v-model="year" type="year" />
    <p>范围：{{ range }}；月份：{{ month }}；年份：{{ year }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
