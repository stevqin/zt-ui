<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridActionButtons,
  type ZtVTableGridRowContextMenu,
} from '@ztechjs/zt-ui';
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
const records: Row[] = Array.from({ length: 36 }, (_, i) => ({
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
const result = ref('点击行操作或右键菜单查看结果');
const actions: ZtVTableGridActionButtons<Row> = [
  {
    type: 'detail',
    text: '详情',
    mode: 'text',
    handler: (row) => {
      result.value = `${row.name}：库存 ${row.stock}`;
    },
  },
];
const rowContextMenu: ZtVTableGridRowContextMenu<Row> = (row) => [
  {
    type: 'copy-code',
    text: '查看编码',
    handler: () => {
      result.value = `商品编码：${row.id}`;
    },
  },
];
</script>

<template>
  <div class="demo">
    <ZtVTableGrid
      :records="records"
      :columns="columns"
      row-key="id"
      :height="340"
      local-pagination
      :pagination="{ pageSize: 10 }"
      :column-settings="{ enabled: true, allowReorder: true, allowVisibility: true }"
      :toolbar-config="['columnsetting', 'export']"
      :filter-config="true"
      :summary-config="{ scope: 'all', label: { text: '全量合计', fields: ['name'] } }"
      :action-buttons="actions"
      show-actions-column
      action-display="inline"
      :row-context-menu="rowContextMenu"
    />
    <p>{{ result }}</p>
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
