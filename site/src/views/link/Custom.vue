<script setup lang="ts">
import { ZtLink } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtLink href="https://example.com" underline="never" target="_blank" rel="noopener noreferrer"
        ><template #icon>↗</template>图标插槽<template #suffix>外链</template></ZtLink
      ><ZtLink
        href="data:text/plain;charset=utf-8,ZT%20UI%20demo"
        download="zt-ui-demo.txt"
        underline="always"
        >下载示例文本</ZtLink
      ><ZtLink href="https://example.com" underline="hover">悬停显示下划线</ZtLink>
    </div>
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
