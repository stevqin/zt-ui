<script setup lang="ts">
import { ZtStatistic, ZtIcon, ZtSpace } from '@ztechjs/zt-ui';
const toWan = (value: number) => (value / 10000).toFixed(2);
</script>
<template>
  <ZtSpace :gap="40" wrap>
    <ZtStatistic
      title="年度累计销售"
      :value="38260000"
      :formatter="toWan"
      suffix="万元"
    />
    <ZtStatistic title="环比增长" :value="12.8" :precision="1" suffix="%">
      <template #prefix><ZtIcon name="arrow-up" status="success" /></template>
    </ZtStatistic>
  </ZtSpace>
</template>
