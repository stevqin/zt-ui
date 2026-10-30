<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtVTableGrid, ZtVTableGridImportDialog, type ZtVTableGridColumn, type ZtVTableGridInstance, type ZtVTableGridSavePayload, type ZtVTableGridActionButtons, type ZtVTableGridRowContextMenu } from '@ztechjs/zt-ui'

type Row = { id: number; name: string; stock: number; active: boolean }
const initial: Row[] = [{id:1,name:'云感针织',stock:32,active:true},{id:2,name:'轻量外套',stock:18,active:true},{id:3,name:'通勤西装',stock:9,active:false}]
const clone = (rows: Row[]) => rows.map(row => ({...row}))
const rows = ref(clone(initial))
const original = ref(clone(initial))
const grid = ref<ZtVTableGridInstance<Row> | null>(null)
const events = ref<string[]>([])
const log = (message: string) => { events.value = [...events.value.slice(-5), message] }
const failNext = ref(false)
const showImport = ref(false)
const file = ref<File | null>(null)
const importing = ref(false)
let nextId = 4
const columns: ZtVTableGridColumn<Row>[] = [
  {field:'id',title:'编号',width:90}, {field:'name',title:'商品名称',width:210,editable:true},
  {field:'stock',title:'库存',width:130,editable:{type:'number',min:0}}, {field:'active',title:'启用',width:110,editable:'checkbox'},
]
function add() { if (!grid.value?.isSaving) rows.value = [...rows.value, {id:nextId++,name:'新增商品',stock:0,active:true}] }
function remove(row: Row) { if (!grid.value?.isSaving) rows.value = rows.value.filter(item => item.id !== row.id) }
const actions: ZtVTableGridActionButtons<Row> = [{type:'delete',text:'删除',mode:'text',status:'danger',handler:remove}]
const menu: ZtVTableGridRowContextMenu<Row> = row => [
  {type:'inspect',text:`查看 ${row.name}`,handler: () => log(`查看：${row.name}`)},
  {type:'delete',text:'删除此行',status:'danger',divided:true,disabled:Boolean(grid.value?.isSaving),handler:remove},
]
async function batchSave() {
  await Promise.resolve()
  if (failNext.value) { failNext.value = false; throw new Error('演示保存失败，请重试') }
}
function saved(payload: ZtVTableGridSavePayload<Row>) {
  rows.value = clone(payload.records ?? rows.value)
  original.value = clone(rows.value)
  log(`saved：新增 ${payload.insertedRows?.length ?? 0} 行，删除 ${payload.deletedRows?.length ?? 0} 行`)
}
function importSample(selected: File) {
  importing.value = true
  rows.value = [...rows.value, {id:nextId++,name:'导入样例商品',stock:24,active:true}]
  log(`已选择 ${selected.name}，追加固定演示记录`)
  importing.value = false
  showImport.value = false
}
async function save() { try { await grid.value?.saveChanges() } catch (error) { log(String(error)) } }
</script>

<template>
  <div class="state-demo">
    <p>新增、删除、单元格修改与导入样例共同形成整表草稿。保存成功后由应用更新独立的 originalRecords 快照。</p>
    <div class="state-demo__controls">
      <ZtButton :disabled="grid?.isSaving" @click="add">新增记录</ZtButton>
      <ZtButton :disabled="grid?.isSaving" @click="failNext = true">下次保存模拟失败</ZtButton>
      <ZtButton :disabled="grid?.isSaving" @click="grid?.cancelChanges()">撤销整表草稿</ZtButton>
      <ZtButton status="primary" :loading="grid?.isSaving" @click="save">保存草稿</ZtButton>
    </div>
    <ZtVTableGrid ref="grid" v-model:records="rows" :original-records="original" :columns="columns" row-key="id" editable batch-edit checkbox
      :local-pagination="false" :batch-save="batchSave" :before-save="payload => payload.records?.every(row => row.name.trim()) !== false"
      :action-buttons="actions" action-display="inline" show-actions-column :row-context-menu="menu" :toolbar-config="['create','import','export','columnsetting','reload']" export-mode="external" :height="320"
      @create="add" @import="showImport = true" @export-request="log('export-request：由应用决定导出范围与格式')"
      @save-start="log('save-start：开始请求')" @saved="saved" @save="log('save：兼容既有的成功事件')"
      @save-error="log(String($event))" @toolbar-action="log(`toolbar-action：${$event}`)" />
    <ZtVTableGridImportDialog v-model="showImport" v-model:file="file" v-model:loading="importing" title="导入样例" description="弹窗只负责选文件。本示例确认后追加一条固定记录，不解析文件或上传。" :instructions="['请选择 .xlsx 文件体验类型校验', '追加的样例记录可随整表草稿保存或撤销']" @confirm="importSample" />
    <output aria-live="polite">{{ events.join('\n') || '修改表格或操作工具栏以查看事件' }}</output>
  </div>
</template>

<style scoped>
.state-demo { display: grid; gap: 12px; }
p { margin: 0; line-height: 1.7; }
.state-demo__controls { display: flex; flex-wrap: wrap; gap: 8px; }
output { white-space: pre-wrap; padding: 12px; border: 1px solid var(--zt-line, #d6deea); border-radius: 8px; background: var(--zt-surface-soft, transparent); font: 12px/1.7 ui-monospace, monospace; }
</style>
