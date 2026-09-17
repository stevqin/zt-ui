<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputNumber } from '@ztechjs/zt-ui';
const bounded = ref<number | null>(5);
</script>

<template>
  <ZtInputNumber v-model="bounded" :min="0" :max="10" :step="2" />
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
