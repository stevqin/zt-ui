<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSliderStatus } from '@ztechjs/zt-ui';
import { ZtSlider } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSliderStatus>('primary');
</script>

<template>
  <ZtSlider :model-value="65" :status="demoStatus" size="large" /><ZtSlider
    :status="demoStatus"
    :model-value="40"
    disabled
  />
</template>
