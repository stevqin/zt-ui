<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtAlertStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtAlert, ZtButton } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtAlertStatus>('info');
const count = ref(0),
  revision = ref(0);
</script>
<template>
  <div class="demo-stack">
    <ZtAlert :key="revision" :status="demoStatus" @close="count++"
      ><template #title>库存不足</template
      ><template #icon>!</template>库存低于安全阈值，请检查采购计划。</ZtAlert
    ><ZtButton @click="revision++">重新展示</ZtButton>
    <p role="status">关闭次数：{{ count }}</p>
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
