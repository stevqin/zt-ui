<script setup lang="ts">
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge :value="1" status="primary"><ZtButton size="small">Primary</ZtButton></ZtBadge
    ><ZtBadge :value="2" status="success"><ZtButton size="small">Success</ZtButton></ZtBadge
    ><ZtBadge :value="3" status="warning"><ZtButton size="small">Warning</ZtButton></ZtBadge
    ><ZtBadge :value="4" status="danger"><ZtButton size="small">Danger</ZtButton></ZtBadge
    ><ZtBadge :value="5" status="info"><ZtButton size="small">Info</ZtButton></ZtBadge>
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
