<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSliderStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSliderStatus>('primary');
const value = ref<ZtSliderValue>(35);
</script>

<template>
  <ZtSlider :status="demoStatus" v-model="value" aria-label="音量" />
  <p>当前值：{{ value }}</p>
</template>
