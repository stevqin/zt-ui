<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtVTableGrid,
  type ZtVTableGridActionButtons,
  type ZtVTableGridColumn,
  type ZtVTableGridInstance,
} from '@ztechjs/zt-ui';
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
const baseColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  {
    field: 'name',
    key: 'product-name',
    title: '商品名称',
    width: 180,
    minWidth: 150,
    sort: true,
    headerStyle: { fontWeight: 600 },
  },
  { field: 'category', title: '品类', width: 100 },
  {
    field: 'price',
    title: '零售价',
    width: 100,
    sort: true,
    formatter: ({ value }: any) => `￥${value}`,
  },
  { field: 'stock', title: '库存', width: 90, sort: true },
  { field: 'status', title: '状态', width: 90 },
];
const selectedMessage = ref('尚未选择记录');
const actionMessage = ref('点击操作列中的按钮查看事件结果');
const eventMessage = ref('事件日志会显示在这里');
const selectionGrid = ref<ZtVTableGridInstance<Product> | null>(null);
function logEvent(name: string, detail = '') {
  eventMessage.value = `${name}${detail ? `：${detail}` : ''}`;
}
const actionButtons: ZtVTableGridActionButtons<Product> = (row) => [
  'detail',
  {
    type: 'restock',
    text: '补货',
    status: 'success',
    visible: row.stock < 80,
    handler: (current) => logEvent('handler', `${current.sku} 补货`),
  },
  { type: 'delete', text: '删除', status: 'danger', disabled: row.status === '在售' },
];
function handleSelection(selected: Product[]) {
  selectedMessage.value = selected.length
    ? `已选择 ${selected.map((row) => row.sku).join('、')}`
    : '尚未选择记录';
  logEvent('selection-change', `${selected.length} 条`);
}
function handleAction(payload: { type: string; row: Product }) {
  actionMessage.value = `${payload.type}：${payload.row.name}`;
  logEvent('action', actionMessage.value);
}
function chooseRows() {
  selectionGrid.value?.setSelectedKeys([1, 3]);
}
function clearRows() {
  selectionGrid.value?.clearSelection();
}
function inspectSelection() {
  const keys = selectionGrid.value?.getSelectedKeys().join(',') || '空';
  const names =
    selectionGrid.value
      ?.getSelectedRows()
      .map((row) => row.name)
      .join('、') || '空';
  logEvent('选择实例方法', `keys=${keys}；rows=${names}`);
}
</script>

<template>
  <div class="example-stack">
    <p class="example-status">{{ selectedMessage }} · {{ actionMessage }}</p>
    <div class="grid-controls">
      <ZtButton @click="chooseRows">选中 1、3</ZtButton
      ><ZtButton @click="clearRows">清空选择</ZtButton
      ><ZtButton @click="inspectSelection">读取 Keys 和 Rows</ZtButton>
    </div>
    <ZtVTableGrid
      ref="selectionGrid"
      :columns="baseColumns"
      :records="rows.slice(0, 12)"
      checkbox
      reserve-checkbox
      show-actions-column
      :action-buttons="actionButtons"
      :pagination="{ pageSize: 6 }"
      height="380px"
      @selection-change="handleSelection"
      @action="handleAction"
      @row-click="logEvent('row-click', $event.sku)"
      @row-dblclick="logEvent('row-dblclick', $event.sku)"
      ><template #toolbar-left="{ selectedRows }"
        ><strong>工具栏：已选 {{ selectedRows.length }} 条</strong></template
      ><template #pager-left="{ selectedCount, total }"
        ><span>共 {{ total }} 条，选中 {{ selectedCount }} 条</span></template
      ></ZtVTableGrid
    >
  </div>
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
