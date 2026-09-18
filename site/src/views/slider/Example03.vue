<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSliderStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSliderStatus>('primary');
const decimal = ref<ZtSliderValue>(0.3);
</script>

<template>
  <ZtSlider
    :status="demoStatus"
    v-model="decimal"
    :min="0"
    :max="1"
    :step="0.1"
    aria-label="透明度"
  />
  <p>当前值：{{ decimal }}</p>
</template>
