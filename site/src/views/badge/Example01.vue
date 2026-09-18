<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtBadgeStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtBadgeStatus>('danger');
const count = ref(12);
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge :status="demoStatus" :value="count"
      ><ZtButton size="small">消息</ZtButton></ZtBadge
    ><ZtBadge :status="demoStatus" :value="200"
      ><ZtButton size="small">消息</ZtButton></ZtBadge
    ><ZtBadge :status="demoStatus" :value="0" show-zero
      ><ZtButton size="small">消息</ZtButton></ZtBadge
    >
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
