<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ZtAlert, ZtConfigProvider } from '@ztechjs/zt-ui';
import type { ZtAlertStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtAlertStatus>('info');
</script>
<template>
  <div class="demo-stack">
    <ZtAlert
      :status="demoStatus"
      :title="demoStatus + ' 提示'"
      description="包含说明文字的页面内提示，可以单独关闭。"
    />
    <ZtConfigProvider size="mini"
      ><ZtAlert
        :status="demoStatus"
        title="固定密度"
        description="全局 mini 下的提示"
    /></ZtConfigProvider>
    <ZtConfigProvider size="large"
      ><ZtAlert
        :status="demoStatus"
        title="固定密度"
        description="全局 large 下的提示"
    /></ZtConfigProvider>
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
