<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputNumber } from '@ztechjs/zt-ui';
const precise = ref<number | null>(1.25);
</script>

<template>
  <ZtInputNumber v-model="precise" :min="0" :max="10" :step="0.25" :precision="2" step-strictly />
</template>

<style scoped>
.number-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.number-demo-row > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
