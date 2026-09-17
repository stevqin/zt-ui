<script setup lang="ts">
import { ZtDescriptions, ZtDescriptionsItem, ZtTag } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtDescriptions title="订单信息" :column="2" border
    ><template #extra><ZtTag status="success">已完成</ZtTag></template
    ><ZtDescriptionsItem label="订单号">A-1001</ZtDescriptionsItem
    ><ZtDescriptionsItem label="客户">安正会员</ZtDescriptionsItem
    ><ZtDescriptionsItem label="备注" :span="2"
      >门店自提，已完成核销。</ZtDescriptionsItem
    ></ZtDescriptions
  >
</template>
