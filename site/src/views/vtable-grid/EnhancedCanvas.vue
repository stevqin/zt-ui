<script setup lang="ts">
import { h, ref } from 'vue'
import { ZtVTableGrid, ZtButton, type ZtVTableGridColumn } from '@ztechjs/zt-ui'
import { VTableTag, VTableText } from '@ztechjs/zt-ui/vtable'

type Row = { id: number; name: string; status: string; note: string }
const rows: Row[] = [{id:1,name:'云感针织',status:'已上架',note:'适合日常穿搭'}, {id:2,name:'轻量外套',status:'待审核',note:'等待补充吊牌信息'}, {id:3,name:'通勤西装',status:'已上架',note:'本周主推款'}]
const message = ref('Canvas 内容通过独立子入口导入')
const columns: ZtVTableGridColumn<Row>[] = [
  {field:'name',title:'商品名称',width:200,headerSlot:'nameHeader'},
  {field:'status',title:'商品状态',width:160,render:({row}) => h(VTableTag,{text:row.status,type:row.status === '已上架' ? 'success' : 'warning',round:true})},
  {field:'note',title:'备注（Canvas 插槽）',width:260,slot:'note'},
]
</script>

<template>
  <div class="canvas-demo">
    <p>render、slot 与 headerSlot 返回 Canvas 图元。DOM 按钮放在工具栏插槽中，Canvas 标签使用独立入口的 VTableTag。</p>
    <ZtVTableGrid :columns="columns" :records="rows" :local-pagination="false" :height="280">
      <template #nameHeader><VTableText text="商品名称 · 自定义表头" :font-size="13" fill="#526a9b" /></template>
      <template #note="{ row }"><VTableTag :text="row.note" type="info" effect="plain" /></template>
      <template #toolbar-right="{ size, selectedRows }"><ZtButton :size="size" @click="message = `当前勾选 ${selectedRows.length} 行`">读取插槽状态</ZtButton></template>
    </ZtVTableGrid>
    <output aria-live="polite">{{ message }}</output>
  </div>
</template>

<style scoped>
.canvas-demo { display: grid; gap: 12px; }
p { margin: 0; line-height: 1.7; } output { font-size: 13px; opacity: .75; }
</style>
