<script setup lang="ts">
import { ZtStep, ZtSteps } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="steps-demo">
    <ZtSteps :active="1" align-center
      ><ZtStep title="上传文件"
        ><template #icon><span>↑</span></template></ZtStep
      ><ZtStep title="解析数据"
        ><template #icon><span>◇</span></template></ZtStep
      ><ZtStep title="保存结果"
        ><template #icon><span>✓</span></template></ZtStep
      ></ZtSteps
    >
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
