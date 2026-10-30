<script setup lang="ts">
import { ZtTypography } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtTypography variant="title" :level="3">库存调拨说明</ZtTypography>
  <ZtTypography variant="paragraph">
    提交调拨前请核对来源仓、目标仓与商品数量。
  </ZtTypography>
  <ZtTypography strong>核对数量</ZtTypography>
  ·
  <ZtTypography mark>本周优先处理</ZtTypography>
  ·
  <ZtTypography deleted>旧规则已作废</ZtTypography>
</template>
