<script setup lang="ts">
import { ref } from 'vue';
import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui';
type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  launchDate: string;
  ownerEmail: string;
  website: string;
  sales: number;
  target: number;
};
const rows: Product[] = Array.from({ length: 37 }, (_, index) => ({
  id: index + 1,
  sku: `ZT-${String(index + 1).padStart(4, '0')}`,
  name: ['云感针织衫', '轻暖羽绒服', '通勤西装', '廓形风衣'][index % 4],
  category: ['针织', '外套', '西装', '风衣'][index % 4],
  price: [399, 899, 1299, 1599][index % 4],
  stock: 18 + ((index * 13) % 120),
  status: index % 3 === 0 ? '待补货' : '在售',
  launchDate: `2026-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')}`,
  ownerEmail: `buyer${index + 1}@example.com`,
  website: `https://example.com/products/${index + 1}`,
  sales: 30 + ((index * 17) % 210),
  target: 160 + (index % 5) * 40,
}));
const summaryColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '记录数', width: 110, summary: 'count' },
  {
    field: 'category',
    title: '品类数',
    width: 110,
    summary: {
      calculate: (_values, currentRows) => new Set(currentRows.map((row) => row.category)).size,
      formatter: (value) => `${value} 类`,
    },
  },
  {
    field: 'price',
    title: '平均售价',
    width: 120,
    summary: { type: 'avg', formatter: (value) => `￥${Number(value).toFixed(2)}` },
    copyFormatter: (row) => `￥${row.price}`,
  },
  { field: 'stock', title: '库存合计', width: 110, summary: 'sum' },
  { field: 'sales', title: '最低销量', width: 110, summary: 'min' },
  { field: 'target', title: '最高目标', width: 110, summary: 'max' },
];
const eventMessage = ref('事件日志会显示在这里');
function logEvent(name: string, detail = '') {
  eventMessage.value = `${name}${detail ? `：${detail}` : ''}`;
}
</script>

<template>
  <ZtVTableGrid
    :columns="summaryColumns"
    :records="rows.slice(0, 10)"
    :summary="{ label: '本页汇总', showWhenEmpty: true }"
    :column-settings="{
      storageKey: 'zt-demo-product-columns',
      allowReorder: true,
      allowVisibility: true,
    }"
    :toolbar="['create', 'import', 'export', 'columnsetting', 'reload']"
    :pagination="false"
    height="350px"
    @create="logEvent('create')"
    @import="logEvent('import')"
    @export="logEvent('export', `${$event.length} 字符`)"
    @column-settings-change="logEvent('column-settings-change', `${$event.visible.length} 列`)"
    ><template #toolbar-right
      ><span class="slot-chip">自定义 toolbar-right</span></template
    ></ZtVTableGrid
  >
  <p role="status">{{ eventMessage }}</p>
</template>

<style scoped>
.example-stack {
  display: grid;
  width: 100%;
  gap: 10px;
}
.example-status {
  min-height: 20px;
  margin: 0;
  color: #536175;
  font-size: 13px;
}
.event-console {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 20px;
  padding: 10px 12px;
  border: 1px solid #dce6f7;
  border-radius: 10px;
  color: #52647e;
  background: #f5f8fe;
  font-size: 13px;
}
.event-console strong {
  color: #315fa8;
}
.grid-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #536175;
  font-size: 13px;
}
.grid-search {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.grid-search input {
  min-width: 240px;
  padding: 8px 12px;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  color: #293242;
  background: #fff;
  outline: none;
}
.grid-search input:focus {
  border-color: #3977eb;
  box-shadow: 0 0 0 3px rgb(57 119 235 / 12%);
}
.slot-chip {
  padding: 4px 8px;
  border-radius: 999px;
  color: #315fa8;
  background: #eaf1ff;
  font-size: 12px;
}
.empty-card {
  display: grid;
  gap: 4px;
  justify-items: center;
  color: #64748b;
}
.empty-card strong {
  color: #334155;
}
@media (max-width: 720px) {
  .grid-search input {
    min-width: 0;
    width: 100%;
  }
}
</style>
