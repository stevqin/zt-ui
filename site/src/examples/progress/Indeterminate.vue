<script setup lang="ts">
import { ZtProgress } from '@ztechjs/zt-ui';
const format = (percentage: number) => `${percentage * 2} / 200 条`;
</script>
<template>
  <ZtProgress indeterminate aria-label="正在连接数据源" />
  <ZtProgress :percentage="75" :format="format" aria-label="订单校验进度" />
  <ZtProgress
    :percentage="45"
    status="danger"
    :show-text="false"
    aria-label="异常中断进度"
  />
</template>
