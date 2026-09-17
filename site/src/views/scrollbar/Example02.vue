<script setup lang="ts">
import { ZtScrollbar } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtScrollbar :max-height="180" always aria-label="横向卡片"
    ><div class="wide-content">
      <article v-for="item in 8" :key="item">卡片 {{ item }}</article>
    </div></ZtScrollbar
  >
</template>

<style scoped>
.scroll-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--zt-border);
}
.scroll-row span {
  color: var(--zt-text-muted);
  font-size: 12px;
}
.wide-content {
  display: flex;
  gap: 12px;
  width: max-content;
  padding: 8px;
}
.wide-content article {
  display: grid;
  place-items: center;
  width: 150px;
  height: 100px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  background: var(--zt-surface-soft);
}
.method-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
</style>
