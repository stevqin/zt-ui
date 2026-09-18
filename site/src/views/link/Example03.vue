<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtLinkStatus } from '@ztechjs/zt-ui';
import { ZtLink } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtLinkStatus>('default');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
</script>

<template>
  <div class="link-row">
    <ZtLink
      :status="demoStatus"
      v-for="size in sizes"
      :key="size"
      href="#"
      :size="size"
      icon="home"
      suffix-icon="arrow-right"
      >{{ size }}</ZtLink
    >
  </div>
</template>

<style scoped>
.link-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
