<script setup lang="ts">
import { ref } from 'vue';
import { ZtTimePicker, type ZtTimePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtTimePickerValue>(['09:00:00', '18:00:00']);
const disabledTime = (value: string) => value < '09:00:00';
</script>

<template>
  <div class="demo">
    <ZtTimePicker
      v-model="value"
      range
      format="HH:mm:ss"
      :second-step="15"
      :disabled-time="disabledTime"
    />
    <p>{{ value }}</p>
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
