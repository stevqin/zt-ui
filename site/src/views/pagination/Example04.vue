<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtPaginationStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtPagination } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtPaginationStatus>('primary');
const currentPage = ref(5);
const pageSize = ref(20);
</script>

<template>
  <ZtPagination
    :status="demoStatus"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="400"
    layout="total, sizes, prev, pager, next, jumper"
  />
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
