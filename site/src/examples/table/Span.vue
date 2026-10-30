<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  { id: 1, category: '出行', name: '帆布提袋', quantity: 8 },
  { id: 2, category: '出行', name: '折叠雨伞', quantity: 12 },
  { id: 3, category: '生活', name: '便携水杯', quantity: 6 },
];
const columns: ZtTableColumn[] = [
  { prop: 'category', label: '类别', fixed: 'left', width: 100 },
  { prop: 'name', label: '商品', width: 180 },
  { prop: 'quantity', label: '数量', width: 100 },
];
</script>
<template>
  <div class="table-demo">
    <p>
      spanMethod 的 rowIndex 是原始数据索引；被合并的单元格返回 [0,
      0]。跨固定区域的合并会截断。
    </p>
    <ZtTable
      :data="rows"
      :columns="columns"
      border
      :span-method="
        ({ rowIndex, columnIndex }) =>
          columnIndex === 0 && rowIndex < 2
            ? rowIndex === 0
              ? [2, 1]
              : [0, 0]
            : [1, 1]
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
</style>
