<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtProgressStatus } from '@ztechjs/zt-ui';
import { ZtProgress } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtProgressStatus>('primary');
</script>

<template>
  <div class="example-stack">
    <ZtProgress :status="demoStatus" :percentage="70"
      ><strong>已完成 7 / 10 项</strong></ZtProgress
    ><ZtProgress
      :status="demoStatus"
      :percentage="40"
      :show-text="false"
      aria-label="后台同步进度"
    />
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
