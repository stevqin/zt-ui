<script setup lang="ts">
import { ref } from 'vue';
import { ZtVTableGrid, ZtSwitch, type ZtVTableGridColumn } from '@ztechjs/zt-ui';
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
const records = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `示例商品 ${i + 1}`,
  brand: i % 2 ? '品牌A' : '品牌B',
  stock: 10 + i,
}));
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'name', title: '商品', width: 180, fixed: 'left', filter: true },
  { field: 'brand', title: '品牌', width: 130, filter: true },
  {
    field: 'stock',
    title: '库存',
    width: 120,
    sort: true,
    align: 'right',
    summary: 'sum',
  },
];
const paged = ref(false);
</script>

<template>
  <div class="demo">
    <ZtSwitch v-model="paged" active-text="本地分页" inactive-text="全量数据" />
    <ZtVTableGrid
      :records="records"
      :columns="columns"
      row-key="id"
      :height="350"
      :local-pagination="paged"
      :pagination="paged ? { pageSize: 10, pageSizes: [10, 20] } : false"
      :toolbar-config="['export', 'columnsetting']"
      summary-config
      checkbox
    />
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
