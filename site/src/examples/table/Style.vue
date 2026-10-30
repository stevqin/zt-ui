<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  { id: 1, name: '便携水杯', stock: 28 },
  { id: 2, name: '帆布提袋', stock: 3 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品' },
  { prop: 'stock', label: '库存', sortable: true },
];
</script>
<template>
  <div class="table-demo">
    <p>回调 rowIndex 始终对应原始数据索引，排序后也保持一致。</p>
    <ZtTable
      :data="rows"
      :columns="columns"
      :row-class-name="({ row }) => (Number(row.stock) < 10 ? 'low-stock' : '')"
      :row-style="
        ({ row }) => ({ fontWeight: Number(row.stock) < 10 ? '600' : '400' })
      "
      :cell-class-name="
        ({ column }) => (column.prop === 'stock' ? 'stock-cell' : '')
      "
      :cell-style="
        ({ row, column }) =>
          column.prop === 'stock' && Number(row.stock) < 10
            ? { color: 'var(--zt-danger, #c0392b)' }
            : {}
      "
    />
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
.table-demo :deep(.low-stock td) {
  background: var(--zt-warning-soft, #fff6e5);
}
.table-demo :deep(.stock-cell) {
  font-variant-numeric: tabular-nums;
}
</style>
