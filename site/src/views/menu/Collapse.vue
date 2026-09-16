<script setup lang="ts">
import { ref } from 'vue'
import { ZtMenu, ZtSwitch, ZtSlider } from '@ztechjs/zt-ui'
const collapsed=ref(false),width=ref<number|string>(240),selected=ref('overview')
const items=[{key:'overview',label:'工作台'},{key:'sales',label:'销售管理',children:[{key:'orders',label:'订单'},{key:'customers',label:'客户'}]},{key:'settings',label:'系统设置'}]
</script>
<template><div class="collapse-controls"><ZtSwitch v-model="collapsed" active-text="折叠" /><label>基准宽度 {{width}}px<ZtSlider :model-value="Number(width)" @update:model-value="value=>{if(typeof value==='number')width=value}" :min="180" :max="360" :show-tooltip="false" size="small" aria-label="纵向菜单宽度" /></label></div><ZtMenu v-model="selected" v-model:collapsed="collapsed" v-model:width="width" :items="items" collapsible resizable :min-width="180" :max-width="360" aria-label="可折叠导航" /></template>
<style scoped>.collapse-controls{display:flex;align-items:center;gap:24px;margin-bottom:18px}.collapse-controls label{font-size:12px;width:180px}</style>
