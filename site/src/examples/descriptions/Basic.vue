<script setup lang="ts">
import { ZtDescriptions, ZtDescriptionsItem, ZtTag } from '@ztechjs/zt-ui';
</script>
<template>
  <div class="descriptions-example">
    <ZtDescriptions title="采购订单" :column="2" border :label-width="104">
      <template #extra><span class="descriptions-example__meta">更新于 2026-11-03 09:40</span></template>
      <ZtDescriptionsItem label="订单编号"><span class="descriptions-example__code">PO202611030018</span></ZtDescriptionsItem>
      <ZtDescriptionsItem label="订单状态"><ZtTag status="success">已审核</ZtTag></ZtDescriptionsItem>
      <ZtDescriptionsItem label="供应商">杭州锦禾服饰有限公司</ZtDescriptionsItem>
      <ZtDescriptionsItem label="采购负责人">王晓宁 · 商品采购部</ZtDescriptionsItem>
      <ZtDescriptionsItem label="交付地址" :span="2">示例市产业园路 18 号 · 华东物流中心 2 号库</ZtDescriptionsItem>
      <ZtDescriptionsItem label="交付说明" :span="2">请按款号与色号分箱，随货附装箱清单；到仓前一个工作日联系收货人员确认预约时间。</ZtDescriptionsItem>
    </ZtDescriptions>
    <ZtDescriptions title="结算信息" :column="2" :label-width="104">
      <template #extra><span class="descriptions-example__meta">人民币 CNY</span></template>
      <ZtDescriptionsItem label="结算方式">月结 30 天</ZtDescriptionsItem>
      <ZtDescriptionsItem label="含税金额"><strong class="descriptions-example__amount">¥ 128,640.00</strong></ZtDescriptionsItem>
      <ZtDescriptionsItem label="发票类型">增值税专用发票</ZtDescriptionsItem>
      <ZtDescriptionsItem label="预计付款日">2026-12-03</ZtDescriptionsItem>
    </ZtDescriptions>
  </div>
</template>
<style scoped>
.descriptions-example { display: grid; gap: 32px; width: 100%; }
.descriptions-example__meta { font-size: 12px; }
.descriptions-example__code { font-variant-numeric: tabular-nums; letter-spacing: .025em; }
.descriptions-example__amount { font-size: 1.08em; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
