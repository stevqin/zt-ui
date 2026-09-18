<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtProgressStatus } from '@ztechjs/zt-ui';
import { ZtProgress } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtProgressStatus>('primary');
</script>

<template>
  <ZtProgress
    :status="demoStatus"
    :percentage="75"
    :format="(value) => `已完成 ${value}%`"
    size="large"
  />
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
