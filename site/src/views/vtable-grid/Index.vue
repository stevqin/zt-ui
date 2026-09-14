<script setup lang="ts">
import { ref } from 'vue'
import {
  ZtButton,
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridQueryParams,
  type ZtVTableGridSavePayload,
} from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

type Product = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  stock: number
  status: string
}

const rows: Product[] = Array.from({ length: 37 }, (_, index) => ({
  id: index + 1,
  sku: `ZT-${String(index + 1).padStart(4, '0')}`,
  name: ['云感针织衫', '轻暖羽绒服', '通勤西装', '廓形风衣'][index % 4],
  category: ['针织', '外套', '西装', '风衣'][index % 4],
  price: [399, 899, 1299, 1599][index % 4],
  stock: 18 + (index * 13) % 120,
  status: index % 3 === 0 ? '待补货' : '在售',
}))

const baseColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', title: '商品名称', width: 180, sort: true },
  { field: 'category', title: '品类', width: 100 },
  { field: 'price', title: '零售价', width: 100, sort: true },
  { field: 'stock', title: '库存', width: 90, sort: true },
  { field: 'status', title: '状态', width: 90 },
]
const editColumns: ZtVTableGridColumn<Product>[] = baseColumns.map(column => ({
  ...column,
  editable: ['name', 'category'].includes(column.field) ? 'text' : ['price', 'stock'].includes(column.field) ? 'number' : false,
}))
const summaryColumns: ZtVTableGridColumn<Product>[] = baseColumns.map(column => ({
  ...column,
  summary: column.field === 'price' ? 'avg' : column.field === 'stock' ? 'sum' : undefined,
}))

const keyword = ref('')
const selectedMessage = ref('尚未选择记录')
const actionMessage = ref('点击操作列中的按钮查看事件结果')
const saveMessage = ref('修改单元格后可批量保存')

async function proxyConfig(params: ZtVTableGridQueryParams<{ keyword: string }>) {
  await new Promise(resolve => setTimeout(resolve, 180))
  const keywordValue = params.form.keyword.trim().toLowerCase()
  const filtered = rows.filter(row => !keywordValue || `${row.sku}${row.name}${row.category}`.toLowerCase().includes(keywordValue))
  const field = typeof params.sort.field === 'string' ? params.sort.field as keyof Product : undefined
  const sorted = field && params.sort.order !== 'normal'
    ? [...filtered].sort((first, second) => {
        const result = String(first[field]).localeCompare(String(second[field]), 'zh-CN', { numeric: true })
        return params.sort.order === 'asc' ? result : -result
      })
    : filtered
  const start = (params.page - 1) * params.pageSize
  return { data: sorted.slice(start, start + params.pageSize), total: sorted.length }
}

function handleSelection(selected: Product[]) {
  selectedMessage.value = selected.length ? `已选择 ${selected.map(row => row.sku).join('、')}` : '尚未选择记录'
}

function handleAction(payload: { type: string; row: Product }) {
  actionMessage.value = `${payload.type}：${payload.row.name}`
}

async function batchSave(payload: ZtVTableGridSavePayload<Product>) {
  await new Promise(resolve => setTimeout(resolve, 350))
  saveMessage.value = `已保存 ${payload.changedRowCount} 行、${payload.changedCellCount} 个字段`
}

const basicCode = sfc(`import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

type Product = { id: number; sku: string; name: string; category: string; price: number }
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', title: '商品名称', width: 180, sort: true },
  { field: 'category', title: '品类', width: 100 },
  { field: 'price', title: '零售价', width: 100 },
]
const records: Product[] = [
  { id: 1, sku: 'ZT-0001', name: '云感针织衫', category: '针织', price: 399 },
]`, `<ZtVTableGrid :columns="columns" :records="records" :pagination="false" :toolbar="false" height="280px" />`)

const remoteCode = sfc(`import { ref } from 'vue'
import { ZtVTableGrid, type ZtVTableGridQueryParams } from '@ztechjs/zt-ui'

const keyword = ref('')
async function proxyConfig(params: ZtVTableGridQueryParams<{ keyword: string }>) {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return response.json() as Promise<{ data: Product[]; total: number }>
}`, `<ZtVTableGrid
  :columns="columns"
  :proxy-config="proxyConfig"
  :form-data="{ keyword }"
  :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
  height="340px"
>
  <template #form="{ query }">
    <input v-model="keyword" placeholder="搜索商品" @keyup.enter="query(true)" />
    <button @click="query(true)">查询</button>
  </template>
</ZtVTableGrid>`)

const selectionCode = sfc(`import { ZtVTableGrid } from '@ztechjs/zt-ui'

function handleSelection(rows: Product[]) {
  console.log('selected', rows)
}
function handleAction(payload: { type: string; row: Product }) {
  console.log(payload.type, payload.row)
}`, `<ZtVTableGrid
  :columns="columns"
  :records="records"
  checkbox
  reserve-checkbox
  show-actions-column
  :action-buttons="['detail', 'edit', 'delete']"
  @selection-change="handleSelection"
  @action="handleAction"
/>`)

const editCode = sfc(`import { ZtVTableGrid, type ZtVTableGridColumn, type ZtVTableGridSavePayload } from '@ztechjs/zt-ui'

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'name', title: '商品名称', editable: 'text' },
  { field: 'price', title: '零售价', editable: 'number' },
  { field: 'stock', title: '库存', editable: 'number' },
]
async function batchSave(payload: ZtVTableGridSavePayload<Product>) {
  await fetch('/api/products/batch', { method: 'PUT', body: JSON.stringify(payload.changes) })
}`, `<ZtVTableGrid :columns="columns" :records="records" editable :batch-save="batchSave" />`)

const summaryCode = sfc(`import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'name', title: '商品名称' },
  { field: 'price', title: '平均零售价', summary: 'avg' },
  { field: 'stock', title: '总库存', summary: 'sum' },
]`, `<ZtVTableGrid
  :columns="columns"
  :records="records"
  :summary="{ label: '本页汇总' }"
  :column-settings="{ storageKey: 'product-grid-columns' }"
  :toolbar="['export', 'columnsetting', 'reload']"
/>`)
</script>

<template>
  <div class="doc-section vtable-docs">
    <h1>VTableGrid 数据表格</h1>
    <p>基于 VisActor VTable 的高性能业务表格，提供本地与远程数据、分页、排序、选择、操作、编辑、汇总和列设置。</p>

    <h2>基础表格</h2>
    <DemoBlock :code="basicCode" desc="固定列、排序和 VTable 原生列选项都可以直接写在 columns 中。">
      <ZtVTableGrid :columns="baseColumns" :records="rows.slice(0, 8)" :pagination="false" :toolbar="false" height="300px" />
    </DemoBlock>

    <h2>远程分页与排序</h2>
    <DemoBlock :code="remoteCode" desc="proxyConfig 统一接收页码、每页条数、排序和查询表单；只应用最后一次请求的结果。">
      <ZtVTableGrid :columns="baseColumns" :proxy-config="proxyConfig" :form-data="{ keyword }" :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }" height="380px">
        <template #form="{ query }">
          <div class="grid-search"><input v-model="keyword" placeholder="输入编码、名称或品类" @keyup.enter="query(true)"><ZtButton status="primary" @click="query(true)">查询</ZtButton></div>
        </template>
      </ZtVTableGrid>
    </DemoBlock>

    <h2>选择与行操作</h2>
    <DemoBlock :code="selectionCode" desc="选择以 rowKey 保存，可跨页保留；标准操作会发出统一 action 事件。">
      <div class="example-stack"><p class="example-status">{{ selectedMessage }} · {{ actionMessage }}</p><ZtVTableGrid :columns="baseColumns" :records="rows.slice(0, 12)" checkbox reserve-checkbox show-actions-column :action-buttons="['detail', 'edit', 'delete']" :pagination="{ pageSize: 6 }" height="360px" @selection-change="handleSelection" @action="handleAction" /></div>
    </DemoBlock>

    <h2>单元格编辑与批量保存</h2>
    <DemoBlock :code="editCode" desc="双击可编辑单元格；组件只提交发生变化的行和字段，保存失败时会保留草稿。">
      <div class="example-stack"><p class="example-status">{{ saveMessage }}</p><ZtVTableGrid :columns="editColumns" :records="rows.slice(0, 8)" editable :batch-save="batchSave" :pagination="false" height="330px" /></div>
    </DemoBlock>

    <h2>汇总与列设置</h2>
    <DemoBlock :code="summaryCode" desc="汇总行支持 sum、avg、count、min、max 或自定义计算；列设置可选本地持久化。">
      <ZtVTableGrid :columns="summaryColumns" :records="rows.slice(0, 10)" :summary="{ label: '本页汇总' }" :column-settings="true" :toolbar="['export', 'columnsetting', 'reload']" :pagination="false" height="350px" />
    </DemoBlock>

    <h2>API</h2>
    <h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>columns</code></td><td><code>ZtVTableGridColumn[]</code></td><td>列配置，支持固定、排序、编辑、格式化和汇总</td></tr>
      <tr><td><code>records / proxyConfig</code></td><td><code>Row[] / async function</code></td><td>本地数据或远程查询函数</td></tr>
      <tr><td><code>pagination</code></td><td><code>boolean | object</code></td><td>分页开关和页容量配置</td></tr>
      <tr><td><code>checkbox / reserveCheckbox</code></td><td><code>boolean</code></td><td>选择列和跨页选择</td></tr>
      <tr><td><code>editable / batchSave</code></td><td><code>boolean / async function</code></td><td>单元格编辑与批量保存</td></tr>
      <tr><td><code>summary</code></td><td><code>boolean | object</code></td><td>只读汇总行</td></tr>
      <tr><td><code>columnSettings</code></td><td><code>boolean | object</code></td><td>列显隐、排序和持久化</td></tr>
      <tr><td><code>toolbar</code></td><td><code>string[] | false</code></td><td>新建、导入、导出、列设置、刷新</td></tr>
      <tr><td><code>tableOptions</code></td><td><code>Record&lt;string, unknown&gt;</code></td><td>其他 VTable ListTable 配置</td></tr>
    </tbody></table>

    <h3>Events</h3>
    <table class="doc-table"><thead><tr><th>事件</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>loaded / error</code></td><td>查询完成或失败</td></tr><tr><td><code>page-change / sort-change</code></td><td>分页或排序变化</td></tr><tr><td><code>selection-change</code></td><td>已选记录变化</td></tr><tr><td><code>action / create / import / export</code></td><td>操作栏和工具栏事件</td></tr><tr><td><code>cell-change / save / save-error</code></td><td>编辑和保存事件</td></tr><tr><td><code>row-click / row-dblclick</code></td><td>行点击事件</td></tr>
    </tbody></table>

    <h3>Slots 与 Expose</h3>
    <table class="doc-table"><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>form</code></td><td>查询区，参数含 formData、query、reload</td></tr><tr><td><code>toolbar-left / toolbar-right</code></td><td>工具栏扩展区域</td></tr><tr><td><code>empty / pager-left / edit-actions</code></td><td>空状态、分页左侧和编辑操作</td></tr><tr><td><code>query / reload / resize / setRecords</code></td><td>查询和表格控制方法</td></tr><tr><td><code>getSelectedRows / clearSelection</code></td><td>选择状态方法</td></tr><tr><td><code>getChanges / saveChanges / cancelChanges / exportCsv</code></td><td>编辑和导出方法</td></tr>
    </tbody></table>
  </div>
</template>

<style scoped>
.example-stack { display: grid; width: 100%; gap: 10px; }
.example-status { min-height: 20px; margin: 0; color: #536175; font-size: 13px; }
.grid-search { display: flex; flex-wrap: wrap; gap: 10px; }
.grid-search input { min-width: 240px; padding: 8px 12px; border: 1px solid #d8dee8; border-radius: 8px; color: #293242; background: #fff; outline: none; }
.grid-search input:focus { border-color: #3977eb; box-shadow: 0 0 0 3px rgb(57 119 235 / 12%); }
@media (max-width: 720px) { .grid-search input { min-width: 0; width: 100%; } }
</style>
