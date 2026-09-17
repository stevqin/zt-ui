<script setup lang="ts">
import { ref } from 'vue';
import { ZtTimePicker, type ZtTimePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtTimePickerValue>('10:15'),
  seconds = ref<ZtTimePickerValue>('12:30:20');
</script>
<template>
  <div class="picker-demo">
    <ZtTimePicker
      v-model="value"
      :minute-step="15"
      clearable
      aria-label="预约时间"
    /><ZtTimePicker
      v-model="seconds"
      format="HH:mm:ss"
      :second-step="10"
      aria-label="精确时间"
    />
    <p>{{ value }} / {{ seconds }}</p>
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
