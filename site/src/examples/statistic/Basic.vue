<script setup lang="ts">
import { ZtStatistic, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace :gap="40" wrap>
    <ZtStatistic title="本月销售额" :value="128600.5" :precision="2" prefix="¥" />
    <ZtStatistic title="目标达成率" :value="86.42" :precision="1" suffix="%" />
    <ZtStatistic title="待回传数据" fallback="待同步" />
  </ZtSpace>
</template>
