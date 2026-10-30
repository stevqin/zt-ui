<script setup lang="ts">
import { ZtText, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace wrap>
    <ZtText>订单编号</ZtText>
    <ZtText tag="strong" weight="bold">DEMO202610001</ZtText>
    <ZtText status="success">已支付</ZtText>
    <ZtText tag="code">order_id</ZtText>
    <ZtText tag="del" status="info">旧价格 ¥399</ZtText>
  </ZtSpace>
</template>
