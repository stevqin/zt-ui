<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtPaginationStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtPagination, ZtSwitch } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtPaginationStatus>('primary');
const hideSingle = ref(true);
</script>

<template>
  <div class="pagination-stack">
    <ZtSwitch v-model="hideSingle" active-text="隐藏单页" /><ZtPagination
      :status="demoStatus"
      :total="5"
      :hide-on-single-page="hideSingle"
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
