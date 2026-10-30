<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePickerPanel, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>('2026-10-01');
</script>

<template>
  <div class="demo">
    <ZtDatePickerPanel
      v-model="value"
      :holidays="[{ key: '2026-10-01', value: '国庆节', type: 'holiday' }]"
    />
    <p>已选：{{ value }}</p>
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
