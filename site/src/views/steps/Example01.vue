<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtStep, ZtSteps } from '@ztechjs/zt-ui';
const active = ref(1);
function next() {
  active.value = active.value >= 3 ? 0 : active.value + 1;
}
</script>

<template>
  <div class="steps-demo">
    <ZtSteps :active="active" finish-status="success"
      ><ZtStep title="提交申请" /><ZtStep title="主管审批" /><ZtStep title="流程完成"
    /></ZtSteps>
    <div class="steps-actions"><ZtButton status="primary" @click="next">下一步</ZtButton></div>
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
