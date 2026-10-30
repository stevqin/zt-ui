<script setup lang="ts">
import { ZtBlockquote } from '@ztechjs/zt-ui';
</script>
<template>
  <div class="quotes">
    <ZtBlockquote title="数据口径" status="primary">报表按订单完成时间统计，取消订单不计入。</ZtBlockquote>
    <ZtBlockquote title="处理完成" status="success" size="small">本批次数据已完成核对，可继续导出。</ZtBlockquote>
    <ZtBlockquote title="审核说明" status="warning">统计周期尚未结束，当前结果仅供过程检查。</ZtBlockquote>
    <ZtBlockquote title="修正要求" status="danger">缺失的必填信息需补全后重新提交。</ZtBlockquote>
    <ZtBlockquote title="补充信息" status="info">来源 URL 存储于 cite 属性，可见说明由 footer 插槽提供。</ZtBlockquote>
    <ZtBlockquote status="default">默认中性色适用于一般补充说明。</ZtBlockquote>
  </div>
</template>
<style scoped>.quotes { display: grid; gap: 14px; }</style>
