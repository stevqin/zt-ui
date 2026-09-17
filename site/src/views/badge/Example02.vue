<script setup lang="ts">
import { ZtBadge } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row badge-row">
    <ZtBadge value="8" size="mini" /><ZtBadge value="8" size="small" /><ZtBadge value="8" /><ZtBadge
      value="8"
      size="medium"
    /><ZtBadge value="8" size="large" />
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
