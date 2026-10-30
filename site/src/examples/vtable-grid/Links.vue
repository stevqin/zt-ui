<script setup lang="ts">
import { ref } from 'vue';
import { ZtVTableGrid, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtVTableGridColumn, ZtVTableGridActionButtons, ZtVTableGridLinkContext } from '@ztechjs/zt-ui';
interface Row { id: string; name: string; stock: number; locked: boolean }
const records: Row[] = [
  { id: 'P1001', name: '轻量背包', stock: 18, locked: false },
  { id: 'P1002', name: '便携水杯', stock: 0, locked: true },
  { id: 'P1003', name: '桌面支架', stock: 32, locked: false },
];
const disabled = ref(false);
const result = ref('点击商品名称或操作列链接查看参数');
function open(row: Row, context: ZtVTableGridLinkContext<Row>) {
  result.value = `商品 ${row.id} · 字段 ${context.field ?? '操作列'} · 第 ${context.rowIndex + 1} 行 · 参数 ${JSON.stringify(context.params)}`;
}
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'id', title: '商品编码', width: 140 },
  { field: 'name', title: '商品详情', width: 200, link: { params: row => ({ productCode: row.id, source: 'name' }), disabled: row => row.locked, handler: open } },
  { field: 'stock', title: '库存', width: 140, link: { text: context => `查看库存（${context.value}）`, params: { panel: 'stock' }, handler: open } },
];
const actions: ZtVTableGridActionButtons<Row> = [
  { type: 'detail', text: '详情', mode: 'link', params: row => ({ id: row.id, source: 'action' }), disabled: row => row.locked, handler: open },
];
</script>
<template>
  <div>
    <ZtSwitch v-model="disabled" aria-label="禁用全部链接" active-text="禁用全部链接" />
    <p role="status">{{ result }}</p>
    <ZtVTableGrid :columns="columns" :records="records" row-key="id" :height="260" :pagination="false" :toolbar="false" :disabled="disabled" show-actions-column action-display="inline" :action-buttons="actions" />
    <p>锁定的商品名称和详情链接不可点击；库存链接演示静态参数。所有链接遵循表格禁用与任务状态，不自动跳转 URL。</p>
  </div>
</template>
