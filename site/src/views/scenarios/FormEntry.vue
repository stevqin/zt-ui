<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ZtForm, ZtFormItem, ZtInput, ZtInputNumber, ZtSelect, ZtButton } from '@ztechjs/zt-ui'
import type { ZtFormInstance, ZtFormRules } from '@ztechjs/zt-ui'
const form=ref<ZtFormInstance>()
const model=reactive({name:'',department:null as string|null,quantity:1 as number|null})
const rules:ZtFormRules={name:[{required:true,message:'请输入申请名称',trigger:'blur'}],department:[{required:true,message:'请选择部门',trigger:'change'}],quantity:[{required:true,type:'number',min:1,message:'数量至少为 1',trigger:'change'}]}
const departments=[{label:'商品中心',value:'product'},{label:'零售运营',value:'retail'},{label:'信息技术',value:'it'}]
const message=ref('')
async function submit(){try{await form.value?.validate();message.value=`已提交：${model.name}，数量 ${model.quantity}（本地演示）`}catch{message.value='请检查标记的字段。'}}
function reset(){form.value?.resetFields();message.value=''}
</script>
<template><div style="max-width:520px"><ZtForm ref="form" :model="model" :rules="rules" label-position="top"><ZtFormItem label="申请名称" prop="name"><ZtInput v-model="model.name" placeholder="例如：门店设备申请" clearable /></ZtFormItem><ZtFormItem label="申请部门" prop="department"><ZtSelect v-model="model.department" :options="departments" placeholder="选择部门" clearable /></ZtFormItem><ZtFormItem label="申请数量" prop="quantity"><ZtInputNumber v-model="model.quantity" :min="1" :max="100" /></ZtFormItem><div style="display:flex;gap:8px"><ZtButton status="primary" @click="submit">提交申请</ZtButton><ZtButton @click="reset">重置</ZtButton></div></ZtForm><p role="status" style="margin-top:16px">{{message}}</p></div></template>
