<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtPaginationStatus } from '@ztechjs/zt-ui';
import { ZtPagination } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtPaginationStatus>('primary');
</script>

<template>
  <div class="pagination-stack">
    <ZtPagination
      :status="demoStatus"
      size="mini"
      layout="sizes, prev, pager, next, jumper"
      :total="100"
    />
    <ZtPagination
      :status="demoStatus"
      size="small"
      layout="sizes, prev, pager, next, jumper"
      :total="100"
    />
    <ZtPagination
      :status="demoStatus"
      size="default"
      layout="sizes, prev, pager, next, jumper"
      :total="100"
    />
    <ZtPagination
      :status="demoStatus"
      size="medium"
      background
      layout="sizes, prev, pager, next, jumper"
      :total="100"
    />
    <ZtPagination
      :status="demoStatus"
      size="large"
      layout="sizes, prev, pager, next, jumper"
      :total="100"
    />
    <ZtPagination
      :status="demoStatus"
      disabled
      layout="sizes, prev, pager, next, jumper"
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
