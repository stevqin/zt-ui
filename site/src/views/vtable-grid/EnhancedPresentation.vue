<script setup lang="ts">
import { computed, ref } from 'vue'
import { ZtSelect, ZtVTableGrid, type ZtComponentSize, type ZtVTableGridColumn, type ZtVTableGridBorderMode, type ZtVTableGridEnhancedSummaryConfig } from '@ztechjs/zt-ui'

type Row = { sku: string; name: string; units: number; amount: number; margin: number }
const rows: Row[] = [{sku:'ZT-001',name:'云感针织',units:32,amount:12768,margin:0.36},{sku:'ZT-002',name:'轻量外套',units:18,amount:16182,margin:0.42},{sku:'ZT-003',name:'通勤西装',units:9,amount:11691,margin:0.31}]
const size = ref<ZtComponentSize>('default')
const border = ref<ZtVTableGridBorderMode>('row')
const source = ref<'backend' | 'frontend'>('backend')
const sizes = ['mini','small','default','medium','large'].map(value => ({label:value,value}))
const borders = [{label:'无边框',value:'none'}, {label:'行分隔',value:'row'}, {label:'单元格',value:'cell'}]
const columns: ZtVTableGridColumn<Row>[] = [
  {field:'sku',title:'商品编码',width:140,fixed:'left'},
  {field:'name',title:'商品名称',width:180,fixed:'left'},
  {field:'units',title:'销量',width:150,align:'right',summary:{type:'sum',summaryField:'total_units'}},
  {field:'amount',title:'销售金额',width:180,align:'right',summary:{type:'sum',summaryField:'total_amount'},style:{color:'#2563a6'}},
  {field:'margin',title:'毛利率',width:160,align:'right',summary:{type:'avg',summaryField:'missing_margin'},fieldFormat:(record: Row) => record.margin == null || String(record.margin) === '' ? '' : `${(Number(record.margin) * 100).toFixed(0)}%`},
]
const summary = computed<ZtVTableGridEnhancedSummaryConfig<Row>>(() => ({
  scope:'all',
  label:{text:source.value === 'backend' ? '后端全量汇总' : '前端全部记录',fields:['sku','name'],align:'center'},
  ...(source.value === 'backend' ? {summaryData:{total_units:120,total_amount:158000}} : {}),
  style:{fontWeight:'bold'},
}))
</script>

<template>
  <div class="presentation-demo">
    <div class="presentation-demo__controls">
      <label>尺寸 <ZtSelect v-model="size" :options="sizes" /></label>
      <label>边框 <ZtSelect v-model="border" :options="borders" /></label>
      <label>汇总来源 <ZtSelect v-model="source" :options="[{label:'后端全量',value:'backend'},{label:'前端记录',value:'frontend'}]" /></label>
    </div>
    <ZtVTableGrid :columns="columns" :records="rows" :size="size" :border-mode="border" :summary-config="summary" :local-pagination="false" :height="300" stripe cell-selection hover-mode="row" :header-style="{fontWeight:600}" :cell-style="{fontFamily:'inherit'}" />
    <p>汇总标题仅合并同一冻结区域内相邻的编码与名称列。后端结果刻意省略 missing_margin，因此毛利率汇总留空；切换前端来源后按全部已加载记录计算。</p>
  </div>
</template>

<style scoped>
.presentation-demo { display: grid; gap: 12px; }
.presentation-demo__controls { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: flex; align-items: center; gap: 8px; font-size: 13px; }
label :deep(.zt-select) { width: 150px; }
p { margin: 0; line-height: 1.7; opacity: .75; }
</style>
