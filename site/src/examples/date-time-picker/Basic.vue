<script setup lang="ts">
import { ref } from 'vue';
import { ZtDateTimePicker, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>('2026-10-30 09:30:00');
</script>

<template>
  <div class="demo">
    <ZtDateTimePicker v-model="value" clearable placeholder="选择发布时间" />
    <p>{{ value || '未设置' }}</p>
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
