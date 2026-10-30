<script setup lang="ts">
import { ZtDescriptions, ZtDescriptionsItem, ZtTag } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtDescriptions title="订单信息" :column="2" border :label-width="90">
    <ZtDescriptionsItem label="订单编号">DEMO202610001</ZtDescriptionsItem>
    <ZtDescriptionsItem label="订单状态">
      <ZtTag status="success">已支付</ZtTag>
    </ZtDescriptionsItem>
    <ZtDescriptionsItem label="收货人">王女士</ZtDescriptionsItem>
    <ZtDescriptionsItem label="联系电话">138 **** 1234</ZtDescriptionsItem>
    <ZtDescriptionsItem label="收货地址" :span="2">
      示例市示例区办公路 100 号
    </ZtDescriptionsItem>
  </ZtDescriptions>
</template>
