<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputNumber } from '@ztechjs/zt-ui';
const value = ref<number | null>(10);
</script>

<template>
  <div class="demo">
    <ZtInputNumber v-model="value" :step="5" step-strictly controls-position="right" />
    <ZtInputNumber v-model="value" :controls="false" />
    <ZtInputNumber :model-value="10" disabled />
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
