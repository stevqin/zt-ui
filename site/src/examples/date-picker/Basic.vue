<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePicker, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>(null);
const disabledDate = (date: Date) => [0, 6].includes(date.getDay());
</script>

<template>
  <div class="demo">
    <ZtDatePicker
      v-model="value"
      clearable
      :disabled-date="disabledDate"
      placeholder="选择工作日"
    />
    <p>{{ value || '未选择' }}</p>
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
