<script setup lang="ts">
import { ZtLayout, ZtHeader, ZtMain, ZtFooter } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtLayout>
    <ZtHeader :height="48">经营分析门户</ZtHeader>
    <ZtMain>报表内容区域</ZtMain>
    <ZtFooter :height="40">数据截至 2026-10-30</ZtFooter>
  </ZtLayout>
</template>
<style scoped>
.zt-header,
.zt-footer {
  background: #1677ff15;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zt-aside {
  background: #1677ff25;
  padding: 16px;
}
.zt-main {
  background: #8881;
  padding: 24px;
}
.zt-layout {
  min-width: 0;
}
</style>
