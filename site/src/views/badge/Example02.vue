<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtBadgeStatus } from '@ztechjs/zt-ui';
import { ZtBadge } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtBadgeStatus>('danger');
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge :status="demoStatus" value="8" size="mini" /><ZtBadge
      :status="demoStatus"
      value="8"
      size="small"
    /><ZtBadge :status="demoStatus" value="8" /><ZtBadge
      :status="demoStatus"
      value="8"
      size="medium"
    /><ZtBadge :status="demoStatus" value="8" size="large" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}

.badge-row {
  gap: 24px !important;
}
</style>
