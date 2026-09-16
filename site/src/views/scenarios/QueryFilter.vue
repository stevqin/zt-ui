<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ZtInput, ZtSelect, ZtDatePicker, ZtButton } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
const filters=reactive({keyword:'',status:null as string|null,dates:null as ZtDatePickerValue})
const options=[{label:'已上架',value:'active'},{label:'待上架',value:'draft'}]
const applied=ref('尚未查询')
function search(){applied.value=JSON.stringify({...filters,page:1},null,2)}
function reset(){filters.keyword='';filters.status=null;filters.dates=null;applied.value='已重置筛选条件'}
</script>
<template><div><div style="display:flex;flex-wrap:wrap;gap:16px;align-items:end"><label style="display:grid;gap:8px">商品关键词<ZtInput v-model="filters.keyword" placeholder="商品名或货号" clearable aria-label="商品关键词" /></label><label style="display:grid;gap:8px">上架状态<ZtSelect v-model="filters.status" :options="options" clearable aria-label="上架状态" /></label><label style="display:grid;gap:8px;max-width:100%">创建日期<ZtDatePicker v-model="filters.dates" range clearable aria-label="创建日期范围" /></label><ZtButton status="primary" @click="search">查询</ZtButton><ZtButton @click="reset">重置</ZtButton></div><pre role="status" style="margin-top:20px;white-space:pre-wrap;overflow-wrap:anywhere">{{applied}}</pre></div></template>
