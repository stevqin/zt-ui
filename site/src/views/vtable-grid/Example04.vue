<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridInstance,
  type ZtVTableGridSavePayload,
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
const editColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', title: '文本', width: 170, editable: true },
  { field: 'category', title: '多行文本', width: 130, editable: 'textarea' },
  {
    field: 'status',
    title: '下拉选择',
    width: 120,
    editable: {
      type: 'select',
      options: [
        { label: '在售', value: '在售' },
        { label: '待补货', value: '待补货' },
      ],
    },
  },
  { field: 'launchDate', title: '日期', width: 130, editable: 'date' },
  {
    field: 'price',
    title: '数字',
    width: 110,
    editable: { type: 'number', min: 0, max: 9999, step: 10 },
  },
  { field: 'ownerEmail', title: '邮箱', width: 210, editable: 'email' },
  { field: 'website', title: '网址', width: 240, editable: 'url' },
];
const saveMessage = ref('修改单元格后可批量保存');
const eventMessage = ref('事件日志会显示在这里');
const editGrid = ref<ZtVTableGridInstance<Product> | null>(null);
const failNextSave = ref(false);
function logEvent(name: string, detail = '') {
  eventMessage.value = `${name}${detail ? `：${detail}` : ''}`;
}
async function batchSave(payload: ZtVTableGridSavePayload<Product>) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (failNextSave.value) {
    failNextSave.value = false;
    throw new Error('演示保存失败：草稿已保留');
  }
  saveMessage.value = `已保存 ${payload.changedRowCount} 行、${payload.changedCellCount} 个字段`;
  logEvent('save', saveMessage.value);
}
async function saveDemo(save: () => Promise<void>) {
  try {
    await save();
  } catch (error) {
    saveMessage.value = String(error);
  }
}
</script>

<template>
  <div class="example-stack">
    <p class="example-status">{{ saveMessage }}</p>
    <div class="grid-controls">
      <ZtButton status="warning" @click="failNextSave = true">下次保存模拟失败</ZtButton
      ><ZtButton
        @click="logEvent('getChanges', `${editGrid?.getChanges().changedCellCount ?? 0} 项`)"
        >读取变更</ZtButton
      >
    </div>
    <ZtVTableGrid
      ref="editGrid"
      :columns="editColumns"
      :records="rows.slice(0, 8)"
      editable
      :batch-save="batchSave"
      :pagination="false"
      height="360px"
      @cell-change="logEvent('cell-change', $event.field)"
      @save-error="logEvent('save-error', String($event))"
      ><template #edit-actions="{ changes, save, cancel }"
        ><span>{{ changes.changedCellCount }} 项待保存</span
        ><ZtButton size="small" @click="cancel">撤销</ZtButton
        ><ZtButton size="small" status="primary" @click="saveDemo(save)">保存</ZtButton></template
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
