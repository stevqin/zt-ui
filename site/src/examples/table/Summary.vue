<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  { id: 1, name: '便携水杯', quantity: 12, amount: 816 },
  { id: 2, name: '帆布提袋', quantity: 8, amount: 256 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品' },
  { prop: 'quantity', label: '数量' },
  { prop: 'amount', label: '金额' },
];
</script>
<template>
  <div class="table-demo">
    <p>默认对数值求和；自定义方法返回与渲染列一一对应的数组。</p>
    <ZtTable :data="rows" :columns="columns" show-summary /><ZtTable
      :data="rows"
      :columns="columns"
      show-summary
      :summary-method="
        ({ data }) => [
          '统计',
          `${data.length} 项`,
          `¥ ${data.reduce((sum, row) => sum + Number(row.amount), 0)}`,
        ]
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
