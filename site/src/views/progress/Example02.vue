<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtProgressStatus } from '@ztechjs/zt-ui';
import { ZtProgress } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtProgressStatus>('primary');
</script>

<template>
  <div class="progress-examples">
    <ZtProgress :status="demoStatus" :percentage="65" aria-label="主题进度" />
  </div>
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
