<script setup lang="ts">
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge value="new"><ZtButton size="small">消息</ZtButton></ZtBadge
    ><ZtBadge value="hot"><ZtButton size="small">评论</ZtButton></ZtBadge>
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
