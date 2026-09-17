<script setup lang="ts">
import { ZtPagination } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtPagination background layout="prev, pager, next" :total="1000" />
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
