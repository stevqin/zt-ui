<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtPageHeader, ZtBreadcrumb, ZtBreadcrumbItem, ZtButton } from '@ztechjs/zt-ui';
const saved = ref(false);
</script>
<template>
  <ZtPageHeader
    title="区域销售报表"
    description="按区域对比销售目标与实际完成情况"
    :show-back="false"
  >
    <template #breadcrumb>
      <ZtBreadcrumb>
        <ZtBreadcrumbItem>报表中心</ZtBreadcrumbItem>
        <ZtBreadcrumbItem>销售分析</ZtBreadcrumbItem>
      </ZtBreadcrumb>
    </template>
    <template #extra>
      <ZtButton status="primary" @click="saved = true">保存报表</ZtButton>
    </template>
    <p role="status">{{ saved ? '当前报表已保存' : '报表尚未保存' }}</p>
  </ZtPageHeader>
</template>
