<script setup lang="ts">
import { ZtLayout, ZtHeader, ZtAside, ZtMain, ZtFooter } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtLayout>
    <ZtHeader :height="48">业务工作台</ZtHeader>
    <ZtLayout>
      <ZtAside :width="130">
        销售分析
        <br />
        库存管理
      </ZtAside>
      <ZtMain>
        <h3>销售概览</h3>
        <p>筛选条件与图表区域</p>
      </ZtMain>
    </ZtLayout>
    <ZtFooter :height="36">示例组织</ZtFooter>
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
