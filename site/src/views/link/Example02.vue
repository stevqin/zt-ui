<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ZtLink } from '@ztechjs/zt-ui';
import type { ZtLinkStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtLinkStatus>('default');
</script>

<template>
  <div class="link-row">
    <ZtLink href="#" :status="demoStatus">{{ demoStatus }}</ZtLink>
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
