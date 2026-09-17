<script setup lang="ts">
import { ZtDatePicker } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>

<template>
  <div class="date-demo-stack"><ZtDatePicker v-for="size in sizes" :key="size" :size="size" /></div>
</template>

<style scoped>
.date-demo-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
}
.date-demo-stack > span {
  color: #737d8b;
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
