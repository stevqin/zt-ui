<script setup lang="ts">
import { ZtScrollbar } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtScrollbar :height="220" aria-label="项目列表"
    ><div v-for="item in 20" :key="item" class="scroll-row">
      项目 {{ item }}<span>最近更新</span>
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
