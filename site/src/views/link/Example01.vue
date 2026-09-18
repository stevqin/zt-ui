<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtLinkStatus } from '@ztechjs/zt-ui';
import { ZtLink } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtLinkStatus>('default');
</script>

<template>
  <div class="link-row">
    <ZtLink :status="demoStatus" href="https://example.com" target="_blank"
      >打开外部链接</ZtLink
    ><ZtLink
      :status="demoStatus"
      href="https://stevqin.github.io/zt-ui/#/getting-started"
      underline="always"
      >始终显示下划线</ZtLink
    ><ZtLink :status="demoStatus" disabled href="/delete">禁用链接</ZtLink>
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
