<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ZtText } from '@ztechjs/zt-ui';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTextStatus>('default');
</script>

<template>
  <div class="text-row">
    <ZtText :status="demoStatus">{{ demoStatus }} 文本</ZtText>
  </div>
</template>

<style scoped>
.text-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.text-limit {
  display: grid;
  gap: 18px;
  width: min(360px, 100%);
}
</style>
