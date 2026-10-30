<script setup lang="ts">
import { ref } from 'vue';
import { ZtTimePicker, type ZtTimePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtTimePickerValue>('09:30');
</script>

<template>
  <div class="demo">
    <ZtTimePicker v-model="value" :minute-step="15" clearable />
    <p>预约时间：{{ value }}</p>
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
