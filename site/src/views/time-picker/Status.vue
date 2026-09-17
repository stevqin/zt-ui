<script setup lang="ts">
import { reactive } from 'vue';
import {
  ZtTimePicker,
  type ZtEntryStatus,
  type ZtTimePickerValue,
} from '@ztechjs/zt-ui';
const statuses: ZtEntryStatus[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];
const values = reactive<ZtTimePickerValue[]>([
  '10:00',
  '10:00',
  '10:00',
  '10:00',
  '10:00',
  '10:00',
]);
</script>
<template>
  <div class="status-demo">
    <div v-for="(status, i) in statuses" :key="status">
      <p>{{ status }}</p>
      <ZtTimePicker v-model="values[i]" :status="status" clearable />
    </div>
  </div>
</template>
<style scoped>
.status-demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
p {
  margin: 0 0 6px;
  font-size: 13px;
}
</style>
