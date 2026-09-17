<script setup lang="ts">
import { ZtStep, ZtSteps } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="steps-demo steps-demo--vertical">
    <ZtSteps direction="vertical" :active="1"
      ><ZtStep title="创建任务" description="设置任务名称与执行周期" /><ZtStep
        title="配置参数"
        description="选择数据源与处理规则" /><ZtStep
        title="发布任务"
        description="确认配置并开始运行"
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
