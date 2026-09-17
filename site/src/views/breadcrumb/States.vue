<script setup lang="ts">
import { ZtBreadcrumb, ZtBreadcrumbItem } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>

<template>
  <div class="example-stack">
    <ZtBreadcrumb v-for="size in sizes" :key="size" :size="size" :aria-label="`${size}面包屑`"
      ><ZtBreadcrumbItem href="https://example.com" target="_blank">首页</ZtBreadcrumbItem
      ><ZtBreadcrumbItem disabled href="https://example.com/private"
        >无权限目录<template #separator>→</template></ZtBreadcrumbItem
      ><ZtBreadcrumbItem>当前页面</ZtBreadcrumbItem></ZtBreadcrumb
    >
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
