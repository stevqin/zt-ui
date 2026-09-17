<script setup lang="ts">
import { ZtPagination } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="pagination-stack">
    <ZtPagination size="mini" layout="sizes, prev, pager, next, jumper" :total="100" />
    <ZtPagination size="small" layout="sizes, prev, pager, next, jumper" :total="100" />
    <ZtPagination size="default" layout="sizes, prev, pager, next, jumper" :total="100" />
    <ZtPagination size="medium" background layout="sizes, prev, pager, next, jumper" :total="100" />
    <ZtPagination size="large" layout="sizes, prev, pager, next, jumper" :total="100" />
    <ZtPagination disabled layout="sizes, prev, pager, next, jumper" :total="100" />
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
