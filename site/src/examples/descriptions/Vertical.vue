<script setup lang="ts">
import { ZtDescriptions, ZtDescriptionsItem, ZtIcon, ZtTag } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtDescriptions title="商品档案" direction="vertical" :column="3" border>
    <template #extra><ZtTag>2026 秋冬</ZtTag></template>
    <ZtDescriptionsItem label="商品名称">羊毛混纺双面呢大衣</ZtDescriptionsItem>
    <ZtDescriptionsItem label="商品款号"><span class="product-code">JZ26AW102801</span></ZtDescriptionsItem>
    <ZtDescriptionsItem>
      <template #label><ZtIcon name="location" :size="14" />所属仓库</template>
      华东中心仓
    </ZtDescriptionsItem>
    <ZtDescriptionsItem label="面料成分" :span="2">羊毛 80% · 聚酯纤维 20%</ZtDescriptionsItem>
    <ZtDescriptionsItem label="养护方式">建议专业干洗</ZtDescriptionsItem>
    <ZtDescriptionsItem label="商品备注" :span="3">按色号独立悬挂存放，避免长时间挤压。出库前请核对吊牌款号、尺码及外包装信息，确保与订单一致。</ZtDescriptionsItem>
  </ZtDescriptions>
</template>
<style scoped>
.product-code { font-variant-numeric: tabular-nums; letter-spacing: .025em; }
</style>
