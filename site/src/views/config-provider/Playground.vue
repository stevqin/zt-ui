<script setup lang="ts">
import { ref } from 'vue'
import { ZtConfigProvider, ZtButton, ZtInput, ZtInputNumber, ZtSelect, ZtDatePicker, ZtDateTimePicker, ZtTag, ZtSwitch, ZtCheckbox, ZtRadio, ZtPagination, ZtModal, ZtDrawer, ZtForm, ZtFormItem, ZtFormGroup, ZtSteps, ZtStep, ZtVTableGrid } from '@ztechjs/zt-ui'
import type { ZtComponentSize, ZtTheme, ZtDatePickerValue } from '@ztechjs/zt-ui'
const size=ref<ZtComponentSize>('default'),theme=ref<ZtTheme>('light'),radius=ref<number|null>(11)
const keyword=ref(''),city=ref<string|null>(null),date=ref<ZtDatePickerValue>(null),datetime=ref<ZtDatePickerValue>(null)
const enabled=ref(true),checked=ref(true),radio=ref('one'),page=ref(1),modal=ref(false),drawer=ref(false)
const sizeOptions=['mini','small','default','medium','large'].map(value=>({label:value,value}))
const cities=[{label:'杭州',value:'hangzhou'},{label:'上海',value:'shanghai'}]
const rows=[{name:'通勤衬衫',stock:36},{name:'轻薄外套',stock:18}]
</script>
<template>
 <div class="config-controls"><label>全局尺寸<ZtSelect v-model="size" :options="sizeOptions" aria-label="全局尺寸" size="small" /></label><label>圆角基准（px）<ZtInputNumber v-model="radius" :min="0" :max="24" size="small" aria-label="圆角基准" /></label><label>暗色主题<ZtSwitch v-model="theme" active-value="dark" inactive-value="light" aria-label="暗色主题" /></label></div>
 <ZtConfigProvider :size="size" :theme="theme" :border-radius="radius ?? 11" class="config-preview">
  <div class="config-row"><ZtButton status="primary">主要操作</ZtButton><ZtButton>次要操作</ZtButton><ZtButton size="mini">固定 mini</ZtButton><ZtTag status="success">已启用</ZtTag></div>
  <ZtForm :model="{keyword,city}" label-position="top" class="config-fields"><ZtFormItem label="关键词"><ZtInput v-model="keyword" placeholder="请输入关键词" clearable /></ZtFormItem><ZtFormItem label="城市"><ZtSelect v-model="city" :options="cities" clearable /></ZtFormItem><ZtFormItem label="日期范围"><ZtDatePicker v-model="date" range clearable /></ZtFormItem><ZtFormItem label="日期时间"><ZtDateTimePicker v-model="datetime" clearable /></ZtFormItem></ZtForm>
  <ZtFormGroup title="通知设置" description="表单分组也继承主题" bordered style="margin-bottom:20px"><div class="config-row"><ZtSwitch v-model="enabled" active-text="开启通知" /><ZtCheckbox v-model="checked">接收提醒</ZtCheckbox><ZtRadio v-model="radio" label="one">标准模式</ZtRadio></div></ZtFormGroup>
  <ZtSteps :active="1" class="config-steps"><ZtStep title="提交" /><ZtStep title="处理中" /><ZtStep title="完成" /></ZtSteps>
  <div class="config-row"><ZtButton @click="modal=true">打开弹窗</ZtButton><ZtButton @click="drawer=true">打开抽屉</ZtButton></div>
  <ZtPagination v-model:current-page="page" :total="100" background />
  <ZtVTableGrid :records="rows" :columns="[{field:'name',title:'商品'},{field:'stock',title:'库存'}]" :height="170" :pagination="false" :toolbar="[]" style="margin-top:20px" />
  <ZtModal v-model="modal" title="继承全局配置"><p>弹窗和内部控件继承当前主题与尺寸。</p><ZtDatePicker v-model="date" range clearable aria-label="弹窗内日期范围" /><ZtButton @click="modal=false">关闭弹窗</ZtButton></ZtModal>
  <ZtDrawer v-model="drawer" title="配置同样作用于抽屉"><ZtInput v-model="keyword" aria-label="抽屉关键词" /><ZtButton style="margin-top:16px" @click="drawer=false">关闭抽屉</ZtButton></ZtDrawer>
 </ZtConfigProvider>
</template>
<style scoped>
.config-controls{display:flex;align-items:end;flex-wrap:wrap;gap:18px;margin-bottom:20px}.config-controls>label{display:grid;gap:8px;font-size:12px;color:#65768c}.config-controls .zt-select{width:150px}.config-preview{padding:22px;border:1px solid var(--glass-line);border-radius:var(--zt-radius);transition:background-color .15s,color .15s}.config-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px}.config-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 20px}.config-fields>*{min-width:0}.config-steps{margin-bottom:24px}@media(max-width:650px){.config-fields{grid-template-columns:1fr}.config-preview{padding:14px}}
</style>
