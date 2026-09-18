<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtPaginationStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtPagination } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtPaginationStatus>('primary');
const page = ref(1),
  message = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtPagination
      :status="demoStatus"
      v-model:current-page="page"
      :page-count="12"
      :pager-count="5"
      prev-text="上一组"
      next-text="下一组"
      @current-change="message = `已切换至第 ${$event} 页`"
    />
    <p role="status">{{ message || '共 12 页，无需提供 total' }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
