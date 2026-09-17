<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtScrollbar, ZtText } from '@ztechjs/zt-ui';
import type { ZtScrollbarInstance } from '@ztechjs/zt-ui';
const scrollbar = ref<ZtScrollbarInstance>();
const position = ref('0, 0');
</script>

<template>
  <div class="method-actions">
    <ZtButton size="small" @click="scrollbar?.setScrollTop(240)">滚动到 240px</ZtButton
    ><ZtText>当前位置：{{ position }}</ZtText>
  </div>
  <ZtScrollbar
    ref="scrollbar"
    :height="160"
    aria-label="可编程滚动区域"
    @scroll="
      (value) => (position = `${Math.round(value.scrollTop)}, ${Math.round(value.scrollLeft)}`)
    "
    ><div v-for="item in 18" :key="item" class="scroll-row">记录 {{ item }}</div></ZtScrollbar
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
