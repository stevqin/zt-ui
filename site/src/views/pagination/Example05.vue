<script setup lang="ts">
import { ZtPagination } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="pagination-stack">
    <ZtPagination size="mini" layout="prev, pager, next" :total="100" /><ZtPagination
      size="small"
      layout="prev, pager, next"
      :total="100"
    /><ZtPagination layout="prev, pager, next" :total="100" /><ZtPagination
      size="medium"
      background
      layout="prev, pager, next"
      :total="100"
    /><ZtPagination size="large" layout="prev, pager, next" :total="100" /><ZtPagination
      disabled
      layout="prev, pager, next"
      :total="100"
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
