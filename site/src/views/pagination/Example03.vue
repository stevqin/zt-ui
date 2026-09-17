<script setup lang="ts">
import { ZtPagination } from '@ztechjs/zt-ui';
const statuses = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;
</script>

<template>
  <div class="pagination-stack">
    <ZtPagination
      v-for="status in statuses"
      :key="status"
      :status="status"
      :total="100"
      layout="prev, pager, next"
    />
  </div>
</template>

<style scoped>
.pagination-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  width: 100%;
}
.pagination-note {
  color: #626b78;
  font-size: 13px;
  white-space: nowrap;
}
</style>
