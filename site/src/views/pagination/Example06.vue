<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtPaginationStatus } from '@ztechjs/zt-ui';
import { ZtPagination } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtPaginationStatus>('primary');
</script>

<template>
  <ZtPagination
    :status="demoStatus"
    layout="slot, ->, prev, pager, next"
    :total="100"
    ><span class="pagination-note">已选择 12 条</span></ZtPagination
  >
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
