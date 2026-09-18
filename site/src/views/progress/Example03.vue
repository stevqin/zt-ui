<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtProgressStatus } from '@ztechjs/zt-ui';
import { ZtProgress } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtProgressStatus>('primary');
</script>

<template>
  <ZtProgress :status="demoStatus" indeterminate aria-label="文件上传" />
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
