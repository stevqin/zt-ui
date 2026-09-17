<script setup lang="ts">
import { ZtSteps, ZtStep, ZtTag } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="example-stack">
    <ZtSteps :active="1"
      ><ZtStep title="创建"
        ><template #description>已创建订单 <strong>A1001</strong></template></ZtStep
      ><ZtStep title="审核"
        ><template #title>人工审核 <ZtTag size="mini" status="warning">待处理</ZtTag></template
        ><template #icon>✓</template></ZtStep
      ><ZtStep title="完成" description="审核通过后结束"
    /></ZtSteps>
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
