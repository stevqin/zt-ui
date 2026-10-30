<script setup lang="ts">
import { ZtBreadcrumb, ZtBreadcrumbItem, ZtIcon } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtBreadcrumb separator=">">
    <ZtBreadcrumbItem href="https://example.com" target="_blank">
      <ZtIcon name="home" />
      工作台
    </ZtBreadcrumbItem>
    <ZtBreadcrumbItem href="https://example.com/reports" disabled>
      归档报表
    </ZtBreadcrumbItem>
    <ZtBreadcrumbItem>2026 年度</ZtBreadcrumbItem>
  </ZtBreadcrumb>
</template>
