<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const data = [
  {
    id: 1,
    name: '杭州旗舰店',
    region: '华东',
    manager: '陈经理',
    sales: 12500,
  },
  {
    id: 2,
    name: '上海静安店',
    region: '华东',
    manager: '李经理',
    sales: 25300,
  },
  {
    id: 3,
    name: '深圳中心店',
    region: '华南',
    manager: '王经理',
    sales: 18600,
  },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', minWidth: 140 },
  { prop: 'region', label: '区域', width: 100 },
  { prop: 'manager', label: '负责人', width: 120 },
  {
    prop: 'sales',
    label: '月度销售额',
    align: 'right',
    formatter: (value) => `¥${Number(value).toLocaleString('zh-CN')}`,
  },
];
</script>
<template><ZtTable :data="data" :columns="columns" /></template>
