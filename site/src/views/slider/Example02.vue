<script setup lang="ts">
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const range = ref<ZtSliderValue>([20, 70]);
</script>

<template>
  <ZtSlider v-model="range" range :step="5" aria-label="价格区间" />
  <p>当前范围：{{ range }}</p>
</template>
