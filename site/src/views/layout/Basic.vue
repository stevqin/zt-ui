<script setup lang="ts">
import { ZtLayout, ZtHeader, ZtAside, ZtMain, ZtFooter } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtLayout class="shell"
    ><ZtHeader :height="48">工作台</ZtHeader
    ><ZtLayout
      ><ZtAside :width="160">销售 · 库存 · 财务</ZtAside
      ><ZtMain>主内容区域，窄屏自动隐藏侧栏。</ZtMain></ZtLayout
    ><ZtFooter :height="40">安正数据平台</ZtFooter></ZtLayout
  >
</template>
<style scoped>
.shell {
  min-height: 240px;
  border: 1px solid #b7c6e0;
  border-radius: 8px;
  overflow: hidden;
}
.shell :deep(header),
.shell :deep(footer) {
  padding: 12px;
  background: #5277b51a;
}
.shell :deep(aside) {
  padding: 16px;
  background: #5277b511;
}
.shell :deep(main) {
  padding: 16px;
}
@media (max-width: 560px) {
  .shell :deep(aside) {
    display: none;
  }
}
</style>
