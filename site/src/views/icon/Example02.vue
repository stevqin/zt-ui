<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtIconStatus } from '@ztechjs/zt-ui';
import { ZtIcon, ZtConfigProvider } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtIconStatus>('default');
</script>
<template>
  <ZtConfigProvider size="large">
    <div class="icon-row">
      <span
        ><ZtIcon :status="demoStatus" name="search" label="默认 1em" /> 默认
        1em</span
      >
      <span
        ><ZtIcon :status="demoStatus" name="search" :size="24" label="24px" />
        数值 24</span
      >
      <span
        ><ZtIcon
          :status="demoStatus"
          name="search"
          size="1.5em"
          label="1.5em"
        />
        1.5em</span
      >
      <span class="percent-box"
        ><ZtIcon :status="demoStatus" name="image" size="50%" label="50%"
      /></span>
      <span>50%（相对 64px 容器）</span>
    </div>
  </ZtConfigProvider>
</template>
<style scoped>
.icon-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 16px;
}
.icon-row > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.percent-box {
  width: 64px;
  height: 64px;
  background: var(--glass-accent-soft);
}
</style>
