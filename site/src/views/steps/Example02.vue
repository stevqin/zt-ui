<script setup lang="ts">
import { ZtStep, ZtSteps } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="steps-demo">
    <ZtSteps :active="2" align-center
      ><ZtStep title="创建订单" description="录入客户与商品信息" /><ZtStep
        title="确认库存"
        description="检查可用库存数量" /><ZtStep title="完成发货" description="生成物流与出库记录"
    /></ZtSteps>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
  max-width: 720px;
}
.steps-demo--scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
.steps-demo--vertical {
  height: 300px;
}
.steps-actions {
  margin-top: 24px;
}
.steps-size-list {
  display: grid;
  width: 100%;
  gap: 12px;
}
</style>
