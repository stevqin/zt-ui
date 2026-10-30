<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePickerPanel, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>(null);
</script>

<template>
  <div class="demo">
    <ZtDatePickerPanel v-model="value" type="daterange" :shortcuts="[]" />
    <p>{{ value || '请选择起止日期' }}</p>
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
