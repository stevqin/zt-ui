<script setup lang="ts">
import { ZtIcon } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large'];
</script>

<template>
  <div class="icon-row">
    <ZtIcon
      v-for="size in sizes"
      :key="size"
      name="search"
      :size="size"
      :label="`${size} 搜索`"
    /><ZtIcon name="image" :size="32" label="图片" />
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
}
.icon-grid > div {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  font-size: 12px;
}
.icon-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.icon-row :deep(svg) {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
