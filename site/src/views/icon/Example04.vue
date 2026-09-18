<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtIconStatus } from '@ztechjs/zt-ui';
import { ZtIcon } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtIconStatus>('default');
</script>

<template>
  <div class="icon-row">
    <ZtIcon
      :status="demoStatus"
      name="arrow-right"
      :rotate="45"
      label="旋转箭头"
    /><ZtIcon :status="demoStatus" name="refresh" spin label="加载中" /><ZtIcon
      :status="demoStatus"
      color="#7c3aed"
      :size="28"
      label="自定义刷新"
      ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 7v5h-5M4 17v-5h5M6 8a7 7 0 0 1 12-2" /></svg
    ></ZtIcon>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
}
.icon-grid > div {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  font-size: 12px;
}
.icon-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.icon-row :deep(svg) {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
