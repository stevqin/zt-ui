<script setup lang="ts">
import { ZtBreadcrumb, ZtBreadcrumbItem } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtBreadcrumb>
    <ZtBreadcrumbItem href="https://example.com" target="_blank">首页</ZtBreadcrumbItem>
    <ZtBreadcrumbItem href="https://example.com/products" target="_blank">
      商品管理
    </ZtBreadcrumbItem>
    <ZtBreadcrumbItem>商品详情</ZtBreadcrumbItem>
  </ZtBreadcrumb>
</template>
