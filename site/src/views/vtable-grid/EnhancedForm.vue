<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ZtVTableGrid, type ZtVTableGridColumn, type ZtVTableGridFormConfig, type ZtVTableGridOptionLoader } from '@ztechjs/zt-ui'

type Row = { id: number; name: string; brand: string; launched: string; stock: number }
type Search = { keyword: string; brand: string | null; launched: string | null }
const form = reactive<Search>({ keyword: '', brand: null, launched: null })
const rows: Row[] = Array.from({length: 28}, (_, i) => ({id: i + 1, name: `${['云感针织', '轻量外套', '通勤西装'][i % 3]} ${i + 1}`, brand: i % 2 ? 'north' : 'south', launched: '2026-10-01', stock: 10 + i * 3}))
const columns: ZtVTableGridColumn<Row>[] = [
  {field:'name', title:'商品', width:220}, {field:'brand', title:'品牌', width:150, fieldFormat: (record: Row) => record.brand === 'north' ? '北岸' : '南屿'},
  {field:'launched', title:'上市日期', width:160}, {field:'stock', title:'库存', width:120, summary:'sum'},
]
const config: ZtVTableGridFormConfig<Search> = {
  data: form, titleWidth: 72, underline: true, collapseStatus: true,
  items: [
    {field:'keyword', title:'商品名称', itemRender:{name:'ZtInput', props:{placeholder:'输入商品名称', clearable:true}}},
    {field:'brand', title:'品牌', itemRender:{name:'ZtSelect', optionSource:'demo.brands', props:{clearable:true, placeholder:'全部品牌'}}},
    {field:'launched', title:'上市日期', folding:true, itemRender:{name:'ZtDatePicker', props:{clearable:true}}},
    {itemRender:{name:'ZtButton', props:{type:'submit', status:'primary'}, content:'查询'}},
    {itemRender:{name:'ZtButton', props:{type:'reset'}, content:'重置'}, collapseNode:true},
  ],
}
const requests = ref(0)
const optionLoader: ZtVTableGridOptionLoader = async (source, {signal}) => {
  if (signal.aborted) throw new DOMException('已取消', 'AbortError')
  requests.value++
  return source === 'demo.brands' ? [{label:'北岸',value:'north'}, {label:'南屿',value:'south'}] : []
}
const filterMethod = (row: Row, search: Search) => row.name.includes(search.keyword.trim()) && (!search.brand || row.brand === search.brand) && (!search.launched || row.launched === search.launched)
</script>

<template>
  <div class="enhanced-form">
    <p>本地默认仍会分页。此例显式设置 <code>localPagination=false</code> 展示全部筛选结果；选项请求由应用注入，不绑定字典服务。</p>
    <ZtVTableGrid :columns="columns" :records="rows" :form-data="form" :form-config="config" :filter-method="filterMethod" :option-loader="optionLoader" :local-pagination="false" :height="380" :summary="true" />
    <small>已加载品牌选项 {{ requests }} 次；同一 Grid 内同源请求共享缓存。明确传入的 formData 优先于 formConfig.data。</small>
  </div>
</template>

<style scoped>
.enhanced-form { display: grid; gap: 12px; color: var(--zt-text, inherit); }
p { margin: 0; line-height: 1.7; } small { opacity: .7; }
</style>
