<script setup lang="ts">
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge :value="1" :offset="[-6, -2]"><ZtButton size="small">消息</ZtButton></ZtBadge
    ><ZtBadge is-dot :offset="[-4, -4]"><ZtButton size="small">消息</ZtButton></ZtBadge>
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
