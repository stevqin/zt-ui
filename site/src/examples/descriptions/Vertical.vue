<script setup lang="ts">
import { ZtDescriptions, ZtDescriptionsItem, ZtIcon } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtDescriptions title="商品概况" direction="vertical" :column="3" border>
    <ZtDescriptionsItem label="商品名称">机械键盘</ZtDescriptionsItem>
    <ZtDescriptionsItem label="款号">DEMO2026A001</ZtDescriptionsItem>
    <ZtDescriptionsItem>
      <template #label>
        <ZtIcon name="location" />
        所属仓库
      </template>
      华东中心仓
    </ZtDescriptionsItem>
    <ZtDescriptionsItem label="商品备注" :span="3">
      支持无线连接，建议使用干燥软布清洁。
    </ZtDescriptionsItem>
  </ZtDescriptions>
</template>
