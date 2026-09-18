<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSliderStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSliderStatus>('primary');
const range = ref<ZtSliderValue>([20, 70]);
</script>

<template>
  <ZtSlider
    :status="demoStatus"
    v-model="range"
    range
    :step="5"
    aria-label="价格区间"
  />
  <p>当前范围：{{ range }}</p>
</template>
