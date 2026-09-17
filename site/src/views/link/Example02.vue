<script setup lang="ts">
import { ZtLink } from '@ztechjs/zt-ui';
import type { ZtLinkStatus } from '@ztechjs/zt-ui';
const statuses: ZtLinkStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
</script>

<template>
  <div class="link-row">
    <ZtLink v-for="status in statuses" :key="status" href="#" :status="status">{{ status }}</ZtLink>
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
