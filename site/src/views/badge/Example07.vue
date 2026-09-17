<script setup lang="ts">
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge :value="12" hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge
    ><ZtBadge is-dot hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge>
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
