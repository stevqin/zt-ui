<script setup lang="ts">
import { ZtSteps, ZtStep } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSteps :active="1" direction="vertical" process-status="error" style="height: 260px">
    <ZtStep title="创建调拨单" description="2026-10-30 09:00 已提交" />
    <ZtStep title="库存校验失败" description="华东仓可用数量不足，请调整商品数量。" />
    <ZtStep title="审批与出库" description="等待库存校验通过" />
  </ZtSteps>
</template>
