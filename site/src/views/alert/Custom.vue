<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtAlertStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtAlert, ZtButton } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtAlertStatus>('info');
const open = ref(true),
  count = ref(0);
</script>
<template>
  <div class="demo-stack">
    <ZtAlert
      v-model="open"
      :status="demoStatus"
      @close="count++"
      ><template #title>库存不足</template
      ><template #icon>!</template>库存低于安全阈值，请检查采购计划。支持 v-model 受控显示。</ZtAlert
    ><div class="demo-row">
      <ZtButton @click="open = true">重新展示</ZtButton>
      <ZtButton @click="open = false">受控关闭</ZtButton>
    </div>
    <p role="status">关闭次数：{{ count }} · 当前 open={{ open }}</p>
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
