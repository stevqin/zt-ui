<script setup lang="ts">
import { ZtStep, ZtSteps } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="steps-demo steps-demo--scroll">
    <ZtSteps :active="1" finish-status="success" process-status="error" :space="210"
      ><ZtStep title="数据校验" /><ZtStep
        title="导入失败"
        description="请修正异常数据后重试" /><ZtStep title="已转人工" status="success"
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
