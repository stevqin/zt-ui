<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ZtButton,
  ZtVTableGrid,
  type ZtComponentSize,
  type ZtVTableGridActionButtons,
  type ZtVTableGridColumn,
  type ZtVTableGridInstance,
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
  launchDate: string
  ownerEmail: string
  website: string
  sales: number
  target: number
}

const rows: Product[] = Array.from({ length: 37 }, (_, index) => ({
  id: index + 1,
  sku: `ZT-${String(index + 1).padStart(4, '0')}`,
  name: ['云感针织衫', '轻暖羽绒服', '通勤西装', '廓形风衣'][index % 4],
  category: ['针织', '外套', '西装', '风衣'][index % 4],
  price: [399, 899, 1299, 1599][index % 4],
  stock: 18 + (index * 13) % 120,
  status: index % 3 === 0 ? '待补货' : '在售',
  launchDate: `2026-${String(index % 9 + 1).padStart(2, '0')}-${String(index % 25 + 1).padStart(2, '0')}`,
  ownerEmail: `buyer${index + 1}@example.com`,
  website: `https://example.com/products/${index + 1}`,
  sales: 30 + (index * 17) % 210,
  target: 160 + (index % 5) * 40,
}))

const baseColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', key: 'product-name', title: '商品名称', width: 180, minWidth: 150, sort: true, headerStyle: { fontWeight: 600 } },
  { field: 'category', title: '品类', width: 100 },
  { field: 'price', title: '零售价', width: 100, sort: true, formatter: ({ value }: any) => `￥${value}` },
  { field: 'stock', title: '库存', width: 90, sort: true },
  { field: 'status', title: '状态', width: 90 },
]
const editColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', title: '文本', width: 170, editable: true },
  { field: 'category', title: '多行文本', width: 130, editable: 'textarea' },
  { field: 'status', title: '下拉选择', width: 120, editable: { type: 'select', options: [{ label: '在售', value: '在售' }, { label: '待补货', value: '待补货' }] } },
  { field: 'launchDate', title: '日期', width: 130, editable: 'date' },
  { field: 'price', title: '数字', width: 110, editable: { type: 'number', min: 0, max: 9999, step: 10 } },
  { field: 'ownerEmail', title: '邮箱', width: 210, editable: 'email' },
  { field: 'website', title: '网址', width: 240, editable: 'url' },
]
const summaryColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '记录数', width: 110, summary: 'count' },
  { field: 'category', title: '品类数', width: 110, summary: { calculate: (_values, currentRows) => new Set(currentRows.map(row => row.category)).size, formatter: value => `${value} 类` } },
  { field: 'price', title: '平均售价', width: 120, summary: { type: 'avg', formatter: value => `￥${Number(value).toFixed(2)}` }, copyFormatter: row => `￥${row.price}` },
  { field: 'stock', title: '库存合计', width: 110, summary: 'sum' },
  { field: 'sales', title: '最低销量', width: 110, summary: 'min' },
  { field: 'target', title: '最高目标', width: 110, summary: 'max' },
]

const keyword = ref('')
const remotePage = ref(1)
const remotePageSize = ref(10)
const gridSize = ref<ZtComponentSize>('default')
const gridSizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']
const selectedMessage = ref('尚未选择记录')
const actionMessage = ref('点击操作列中的按钮查看事件结果')
const saveMessage = ref('修改单元格后可批量保存')
const eventMessage = ref('事件日志会显示在这里')
const selectionGrid = ref<ZtVTableGridInstance<Product> | null>(null)
const editGrid = ref<ZtVTableGridInstance<Product> | null>(null)
const apiGrid = ref<ZtVTableGridInstance<Product> | null>(null)
const failNextSave = ref(false)
const stateMode = ref<'empty' | 'loading' | 'disabled'>('empty')
const failNextQuery = ref(false)
const stateRows = computed(() => stateMode.value === 'empty' ? [] : rows.slice(0, 4))

function logEvent(name: string, detail = '') {
  eventMessage.value = `${name}${detail ? `：${detail}` : ''}`
}

const actionButtons: ZtVTableGridActionButtons<Product> = row => [
  'detail',
  { type: 'restock', text: '补货', status: 'success', visible: row.stock < 80, handler: current => logEvent('handler', `${current.sku} 补货`) },
  { type: 'delete', text: '删除', status: 'danger', disabled: row.status === '在售' },
]

async function proxyConfig(params: ZtVTableGridQueryParams<{ keyword: string }>) {
  await new Promise(resolve => setTimeout(resolve, 180))
  if (failNextQuery.value) {
    failNextQuery.value = false
    throw new Error('演示请求失败')
  }
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

async function failQuery(query: (resetPage?: boolean) => Promise<void>) {
  failNextQuery.value = true
  await query(false)
}

function handleSelection(selected: Product[]) {
  selectedMessage.value = selected.length ? `已选择 ${selected.map(row => row.sku).join('、')}` : '尚未选择记录'
  logEvent('selection-change', `${selected.length} 条`)
}

function handleAction(payload: { type: string; row: Product }) {
  actionMessage.value = `${payload.type}：${payload.row.name}`
  logEvent('action', actionMessage.value)
}

async function batchSave(payload: ZtVTableGridSavePayload<Product>) {
  await new Promise(resolve => setTimeout(resolve, 350))
  if (failNextSave.value) {
    failNextSave.value = false
    throw new Error('演示保存失败：草稿已保留')
  }
  saveMessage.value = `已保存 ${payload.changedRowCount} 行、${payload.changedCellCount} 个字段`
  logEvent('save', saveMessage.value)
}

async function saveDemo(save: () => Promise<void>) {
  try {
    await save()
  } catch (error) {
    saveMessage.value = String(error)
  }
}

function chooseRows() {
  selectionGrid.value?.setSelectedKeys([1, 3])
}

function clearRows() {
  selectionGrid.value?.clearSelection()
}

function inspectSelection() {
  const keys = selectionGrid.value?.getSelectedKeys().join(',') || '空'
  const names = selectionGrid.value?.getSelectedRows().map(row => row.name).join('、') || '空'
  logEvent('选择实例方法', `keys=${keys}；rows=${names}`)
}

function replaceApiRecords() {
  apiGrid.value?.setRecords(rows.slice(8, 13), 5)
  logEvent('setRecords', '已替换为第 9–13 条数据')
}

function inspectTable() {
  logEvent('getTableInstance', apiGrid.value?.getTableInstance() ? '实例已就绪' : '实例未就绪')
}

function downloadFromApi() {
  const csv = apiGrid.value?.exportCsv('products.csv') ?? ''
  logEvent('exportCsv', `${csv.split('\n').length - 1} 行`)
}

const productTypeCode = `type Product = {
  id: number
  sku: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  launchDate: string
  ownerEmail: string
  website: string
  sales: number
  target: number
}`

const productRecordCode = `const records: Product[] = [{
  id: 1,
  sku: 'ZT-0001',
  name: '云感针织衫',
  category: '针织',
  price: 399,
  stock: 42,
  status: '在售',
  launchDate: '2026-09-14',
  ownerEmail: 'buyer@example.com',
  website: 'https://example.com/products/1',
  sales: 128,
  target: 200,
}]`

const basicCode = sfc(`import { ref } from 'vue'
import { ZtVTableGrid, type ZtComponentSize, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

type Product = { id: number; sku: string; name: string; category: string; price: number }
const size = ref<ZtComponentSize>('default')
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  { field: 'name', title: '商品名称', width: 180, sort: true },
  { field: 'category', title: '品类', width: 100 },
  { field: 'price', title: '零售价', width: 100 },
]
const records: Product[] = [
  { id: 1, sku: 'ZT-0001', name: '云感针织衫', category: '针织', price: 399 },
]`, `<select v-model="size"><option>mini</option><option>small</option><option>default</option><option>medium</option><option>large</option></select>
<ZtVTableGrid :columns="columns" :records="records" :row-key="row => row.id" :size="size" :pagination="false" :toolbar="false" :table-options="{ overscrollBehavior: 'none' }" height="280px" />`)

const remoteCode = sfc(`import { ref } from 'vue'
import { ZtVTableGrid, type ZtVTableGridColumn, type ZtVTableGridQueryParams } from '@ztechjs/zt-ui'

${productTypeCode}

const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120 },
  { field: 'name', title: '商品名称', width: 180, sort: true },
  { field: 'price', title: '零售价', width: 100, sort: true },
]
async function proxyConfig(params: ZtVTableGridQueryParams<{ keyword: string }>) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return response.json() as Promise<{ data: Product[]; total: number }>
}`, `<ZtVTableGrid
  v-model:current-page="page"
  v-model:page-size="pageSize"
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
  <template #toolbar-right><span>远程数据</span></template>
</ZtVTableGrid>`)

const selectionCode = sfc(`import { ref } from 'vue'
import { ZtVTableGrid, type ZtVTableGridActionButtons, type ZtVTableGridColumn, type ZtVTableGridInstance } from '@ztechjs/zt-ui'

${productTypeCode}
${productRecordCode}

const grid = ref<ZtVTableGridInstance<Product> | null>(null)
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120 },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'stock', title: '库存', width: 90 },
  { field: 'status', title: '状态', width: 90 },
]
const actions: ZtVTableGridActionButtons<Product> = row => [
  'detail',
  { type: 'restock', text: '补货', status: 'success', visible: row.stock < 80, handler: current => console.log('补货', current) },
  { type: 'delete', text: '删除', status: 'danger', disabled: row.status === '在售' },
]
function handleSelection(rows: Product[]) { console.log('selected', rows) }
function handleAction(payload: { type: string; row: Product }) { console.log(payload.type, payload.row) }`, `<button @click="grid?.setSelectedKeys([1, 3])">选中 1、3</button>
<button @click="grid?.clearSelection()">清空</button>
<button @click="console.log(grid?.getSelectedKeys(), grid?.getSelectedRows())">读取选择</button>
<ZtVTableGrid ref="grid" :columns="columns" :records="records" checkbox reserve-checkbox show-actions-column :action-buttons="actions" @selection-change="handleSelection" @action="handleAction">
  <template #toolbar-left="{ selectedRows }">已选 {{ selectedRows.length }} 条</template>
  <template #pager-left="{ selectedCount, total }">共 {{ total }} 条，选中 {{ selectedCount }} 条</template>
</ZtVTableGrid>`)

const editCode = sfc(`import { ZtVTableGrid, type ZtVTableGridColumn, type ZtVTableGridSavePayload } from '@ztechjs/zt-ui'

${productTypeCode}
${productRecordCode}

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'name', title: '文本', editable: true },
  { field: 'category', title: '多行文本', editable: 'textarea' },
  { field: 'launchDate', title: '日期', editable: 'date' },
  { field: 'price', title: '数字', editable: { type: 'number', min: 0, max: 9999, step: 10 } },
  { field: 'status', title: '选择', editable: { type: 'select', options: [{ label: '在售', value: '在售' }] } },
  { field: 'ownerEmail', title: '邮箱', editable: 'email' },
  { field: 'website', title: '网址', editable: 'url' },
]
async function batchSave(payload: ZtVTableGridSavePayload<Product>) {
  await fetch('/api/products/batch', { method: 'PUT', body: JSON.stringify(payload.changes) })
}`, `<ZtVTableGrid :columns="columns" :records="records" editable :batch-save="batchSave">
  <template #edit-actions="{ changes, save, cancel }">
    <span>{{ changes.changedCellCount }} 项待保存</span>
    <button @click="cancel">撤销</button><button @click="save().catch(console.error)">保存</button>
  </template>
</ZtVTableGrid>`)

const summaryCode = sfc(`import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

${productTypeCode}
${productRecordCode}

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '记录数', summary: 'count' },
  { field: 'price', title: '平均售价', summary: { type: 'avg', formatter: value => '￥' + Number(value).toFixed(2) }, copyFormatter: row => '￥' + row.price },
  { field: 'stock', title: '库存合计', summary: 'sum' },
  { field: 'sales', title: '最低销量', summary: 'min' },
  { field: 'target', title: '最高目标', summary: 'max' },
  { field: 'category', title: '品类数', summary: { calculate: (_, rows) => new Set(rows.map(row => row.category)).size } },
]`, `<ZtVTableGrid
  :columns="columns"
  :records="records"
  :summary="{ label: '本页汇总' }"
  :column-settings="{ storageKey: 'product-grid-columns', allowReorder: true, allowVisibility: true }"
  :toolbar="['create', 'import', 'export', 'columnsetting', 'reload']"
/>`)
const stateCode = sfc(`import { computed, ref } from 'vue'
import { ZtButton, ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

${productTypeCode}
const sourceRows: Product[] = [{
  id: 1, sku: 'ZT-0001', name: '云感针织衫', category: '针织', price: 399,
  stock: 42, status: '在售', launchDate: '2026-09-14', ownerEmail: 'buyer@example.com',
  website: 'https://example.com/products/1', sales: 128, target: 200,
}]
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120 },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'stock', title: '库存', width: 90 },
]

const mode = ref<'empty' | 'loading' | 'disabled'>('empty')
const records = computed(() => mode.value === 'empty' ? [] : sourceRows)`, `<ZtButton @click="mode = 'empty'">空状态</ZtButton>
<ZtButton @click="mode = 'loading'">加载中</ZtButton>
<ZtButton @click="mode = 'disabled'">禁用</ZtButton>
<ZtVTableGrid
  :columns="columns"
  :records="records"
  :loading="mode === 'loading'"
  :disabled="mode === 'disabled'"
  :pagination="false"
>
  <template #empty><strong>没有符合条件的商品</strong></template>
</ZtVTableGrid>`)

const apiCode = sfc(`import { ref } from 'vue'
import { ZtButton, ZtVTableGrid, type ZtVTableGridColumn, type ZtVTableGridInstance, type ZtVTableGridQueryParams } from '@ztechjs/zt-ui'

${productTypeCode}
${productRecordCode}
const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120 },
  { field: 'name', title: '商品名称', width: 180 },
  { field: 'price', title: '零售价', width: 100 },
]
async function proxyConfig(params: ZtVTableGridQueryParams) {
  console.log('query', params)
  return { data: records, total: records.length }
}

const grid = ref<ZtVTableGridInstance<Product> | null>(null)`, `<ZtButton @click="grid?.query(true)">query</ZtButton>
<ZtButton @click="grid?.reload()">reload</ZtButton>
<ZtButton @click="grid?.resize()">resize</ZtButton>
<ZtButton @click="grid?.setRecords(records.slice(0, 5), 5)">setRecords</ZtButton>
<ZtButton @click="grid?.getTableInstance()">getTableInstance</ZtButton>
<ZtButton @click="grid?.exportCsv('products.csv')">exportCsv</ZtButton>
<ZtVTableGrid ref="grid" :columns="columns" :proxy-config="proxyConfig" :auto-load="false" />`)
</script>

<template>
  <div class="doc-section vtable-docs">
    <h1>VTableGrid 数据表格</h1>
    <p>基于 VisActor VTable 的高性能业务表格，提供本地与远程数据、分页、排序、选择、操作、编辑、汇总和列设置。</p>
    <p class="event-console"><strong>最近事件</strong><span>{{ eventMessage }}</span></p>

    <h2>基础表格</h2>
    <DemoBlock :code="basicCode" desc="固定列、格式化、样式、rowKey、tableOptions 和五档 size 均可直接配置。">
      <div class="example-stack">
        <div class="grid-controls"><span>尺寸</span><ZtButton v-for="size in gridSizes" :key="size" :size="size" :status="gridSize === size ? 'primary' : 'default'" @click="gridSize = size">{{ size }}</ZtButton></div>
        <ZtVTableGrid :columns="baseColumns" :records="rows.slice(0, 8)" :row-key="row => row.id" :size="gridSize" :pagination="false" :toolbar="false" :table-options="{ overscrollBehavior: 'none' }" height="300px" />
      </div>
    </DemoBlock>

    <h2>远程分页与排序</h2>
    <DemoBlock :code="remoteCode" desc="proxyConfig 统一接收页码、每页条数、排序和查询表单；只应用最后一次请求的结果。">
      <div class="example-stack"><p class="example-status">{{ eventMessage }}</p><ZtVTableGrid v-model:current-page="remotePage" v-model:page-size="remotePageSize" :columns="baseColumns" :proxy-config="proxyConfig" :form-data="{ keyword }" :pagination="{ pageSize: 10, pageSizes: [10, 20, 50], background: true }" height="380px" @loaded="logEvent('loaded', `${$event.total} 条`)" @error="logEvent('error', String($event))" @page-change="logEvent('page-change', `第 ${$event.currentPage} 页`)" @sort-change="logEvent('sort-change', `${String($event.field)} ${$event.order}`)">
        <template #form="{ query, reload }">
          <div class="grid-search"><input v-model="keyword" placeholder="输入编码、名称或品类" @keyup.enter="query(true)"><ZtButton status="primary" @click="query(true)">查询</ZtButton><ZtButton @click="reload">重新加载</ZtButton><ZtButton status="danger" @click="failQuery(query)">模拟失败</ZtButton><span>第 {{ remotePage }} 页 / {{ remotePageSize }} 条</span></div>
        </template>
      </ZtVTableGrid></div>
    </DemoBlock>

    <h2>选择与行操作</h2>
    <DemoBlock :code="selectionCode" desc="支持表头全选、跨页保留、自定义操作、行事件，以及选择相关 Expose 方法和工具栏插槽。">
      <div class="example-stack"><p class="example-status">{{ selectedMessage }} · {{ actionMessage }}</p><div class="grid-controls"><ZtButton @click="chooseRows">选中 1、3</ZtButton><ZtButton @click="clearRows">清空选择</ZtButton><ZtButton @click="inspectSelection">读取 Keys 和 Rows</ZtButton></div><ZtVTableGrid ref="selectionGrid" :columns="baseColumns" :records="rows.slice(0, 12)" checkbox reserve-checkbox show-actions-column :action-buttons="actionButtons" :pagination="{ pageSize: 6 }" height="380px" @selection-change="handleSelection" @action="handleAction" @row-click="logEvent('row-click', $event.sku)" @row-dblclick="logEvent('row-dblclick', $event.sku)"><template #toolbar-left="{ selectedRows }"><strong>工具栏：已选 {{ selectedRows.length }} 条</strong></template><template #pager-left="{ selectedCount, total }"><span>共 {{ total }} 条，选中 {{ selectedCount }} 条</span></template></ZtVTableGrid></div>
    </DemoBlock>

    <h2>单元格编辑与批量保存</h2>
    <DemoBlock :code="editCode" desc="覆盖 text、textarea、date、number、select、email、url 编辑器；自定义 edit-actions 插槽可调用保存和撤销。">
      <div class="example-stack"><p class="example-status">{{ saveMessage }}</p><div class="grid-controls"><ZtButton status="warning" @click="failNextSave = true">下次保存模拟失败</ZtButton><ZtButton @click="logEvent('getChanges', `${editGrid?.getChanges().changedCellCount ?? 0} 项`)">读取变更</ZtButton></div><ZtVTableGrid ref="editGrid" :columns="editColumns" :records="rows.slice(0, 8)" editable :batch-save="batchSave" :pagination="false" height="360px" @cell-change="logEvent('cell-change', $event.field)" @save-error="logEvent('save-error', String($event))"><template #edit-actions="{ changes, save, cancel }"><span>{{ changes.changedCellCount }} 项待保存</span><ZtButton size="small" @click="cancel">撤销</ZtButton><ZtButton size="small" status="primary" @click="saveDemo(save)">保存</ZtButton></template></ZtVTableGrid></div>
    </DemoBlock>

    <h2>汇总与列设置</h2>
    <DemoBlock :code="summaryCode" desc="同时演示 sum、avg、count、min、max、自定义计算、copyFormatter、列显隐/排序持久化和全部工具栏事件。">
      <ZtVTableGrid :columns="summaryColumns" :records="rows.slice(0, 10)" :summary="{ label: '本页汇总', showWhenEmpty: true }" :column-settings="{ storageKey: 'zt-demo-product-columns', allowReorder: true, allowVisibility: true }" :toolbar="['create', 'import', 'export', 'columnsetting', 'reload']" :pagination="false" height="350px" @create="logEvent('create')" @import="logEvent('import')" @export="logEvent('export', `${$event.length} 字符`)" @column-settings-change="logEvent('column-settings-change', `${$event.visible.length} 列`)"><template #toolbar-right><span class="slot-chip">自定义 toolbar-right</span></template></ZtVTableGrid>
    </DemoBlock>

    <h2>加载、空状态与禁用</h2>
    <DemoBlock :code="stateCode" desc="一个示例切换 loading、empty 插槽和 disabled；禁用态会阻止 Canvas 内的选择、排序、编辑和行操作。">
      <div class="example-stack"><div class="grid-controls"><ZtButton @click="stateMode = 'empty'">空状态</ZtButton><ZtButton @click="stateMode = 'loading'">加载中</ZtButton><ZtButton @click="stateMode = 'disabled'">禁用</ZtButton></div><ZtVTableGrid :columns="editColumns.slice(0, 6)" :records="stateRows" :loading="stateMode === 'loading'" :disabled="stateMode === 'disabled'" checkbox show-actions-column editable :pagination="false" height="260px"><template #empty><div class="empty-card"><strong>没有符合条件的商品</strong><span>请调整筛选条件后重试</span></div></template></ZtVTableGrid></div>
    </DemoBlock>

    <h2>实例方法与延迟加载</h2>
    <DemoBlock :code="apiCode" desc="autoLoad=false 时由调用方启动查询；下方按钮覆盖 query、reload、resize、setRecords、getTableInstance 和 exportCsv。">
      <div class="example-stack"><div class="grid-controls"><ZtButton status="primary" @click="apiGrid?.query(true)">query</ZtButton><ZtButton @click="apiGrid?.reload()">reload</ZtButton><ZtButton @click="apiGrid?.resize()">resize</ZtButton><ZtButton @click="replaceApiRecords">setRecords</ZtButton><ZtButton @click="inspectTable">getTableInstance</ZtButton><ZtButton @click="downloadFromApi">exportCsv</ZtButton></div><ZtVTableGrid ref="apiGrid" :columns="baseColumns" :proxy-config="proxyConfig" :form-data="{ keyword: '' }" :auto-load="false" :pagination="false" height="280px" /></div>
    </DemoBlock>

    </div>
</template>

<style scoped>
.example-stack { display: grid; width: 100%; gap: 10px; }
.example-status { min-height: 20px; margin: 0; color: #536175; font-size: 13px; }
.event-console { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 20px; padding: 10px 12px; border: 1px solid #dce6f7; border-radius: 10px; color: #52647e; background: #f5f8fe; font-size: 13px; }
.event-console strong { color: #315fa8; }
.grid-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: #536175; font-size: 13px; }
.grid-search { display: flex; flex-wrap: wrap; gap: 10px; }
.grid-search input { min-width: 240px; padding: 8px 12px; border: 1px solid #d8dee8; border-radius: 8px; color: #293242; background: #fff; outline: none; }
.grid-search input:focus { border-color: #3977eb; box-shadow: 0 0 0 3px rgb(57 119 235 / 12%); }
.slot-chip { padding: 4px 8px; border-radius: 999px; color: #315fa8; background: #eaf1ff; font-size: 12px; }
.empty-card { display: grid; gap: 4px; justify-items: center; color: #64748b; }
.empty-card strong { color: #334155; }
@media (max-width: 720px) { .grid-search input { min-width: 0; width: 100%; } }
</style>
