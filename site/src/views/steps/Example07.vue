<script setup lang="ts">
import { ZtStep, ZtSteps } from '@ztechjs/zt-ui';
const stepSizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>

<template>
  <div class="steps-size-list">
    <ZtSteps v-for="size in stepSizes" :key="size" :size="size" :active="1" simple
      ><ZtStep title="提交" /><ZtStep title="审核" /><ZtStep title="完成"
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
