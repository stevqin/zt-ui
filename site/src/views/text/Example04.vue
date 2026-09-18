<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
import { ZtText } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTextStatus>('default');
</script>

<template>
  <div class="text-row">
    <ZtText :status="demoStatus" tag="strong">强调内容</ZtText
    ><ZtText :status="demoStatus" tag="code">const total = 8</ZtText
    ><ZtText :status="demoStatus" tag="mark">重点标记</ZtText>
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
