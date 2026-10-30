<script setup lang="ts">
import { ref } from 'vue';
import { ZtDateTimePicker, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>(null);
</script>

<template>
  <div class="demo">
    <ZtDateTimePicker v-model="value" range range-panel-mode="double" />
    <p>活动时间：{{ value || '未选择' }}</p>
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
