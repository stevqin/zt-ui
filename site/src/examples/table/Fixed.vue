<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  {
    id: 'P001',
    name: '便携水杯',
    category: '生活',
    material: '不锈钢',
    warehouse: '中央仓',
    stock: 28,
  },
  {
    id: 'P002',
    name: '帆布提袋',
    category: '出行',
    material: '帆布',
    warehouse: '北区仓',
    stock: 36,
  },
];
const columns: ZtTableColumn[] = [
  { prop: 'id', label: '编号', fixed: 'left', width: 120 },
  { prop: 'name', label: '商品', width: 180 },
  { prop: 'category', label: '类别', width: 160 },
  { prop: 'material', label: '材质', width: 160 },
  { prop: 'warehouse', label: '仓库', width: 180 },
  { prop: 'stock', label: '库存', fixed: 'right', width: 100 },
];
</script>
<template>
  <div class="table-demo">
    <p>横向滚动查看左右固定列；固定列需要设置明确宽度。</p>
    <ZtTable :data="rows" :columns="columns" :max-height="240" border />
  </div>
</template>
<style scoped>
.table-demo {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.table-demo p {
  margin: 0;
}
</style>
