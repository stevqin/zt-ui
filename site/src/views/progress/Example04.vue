<script setup lang="ts">
import { ZtProgress } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtProgress :percentage="75" :format="(value) => `已完成 ${value}%`" size="large" />
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
