<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
import { ZtText } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTextStatus>('default');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
</script>

<template>
  <div class="text-row">
    <ZtText
      :status="demoStatus"
      v-for="size in sizes"
      :key="size"
      :size="size"
      weight="semibold"
      >{{ size }} 文本</ZtText
    >
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
