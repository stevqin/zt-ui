<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ZtInputOtp, ZtForm, ZtFormItem, ZtButton } from '@ztechjs/zt-ui'
import type { ZtFormInstance, ZtFormRules } from '@ztechjs/zt-ui'
const model=reactive({code:''}),form=ref<ZtFormInstance>(),result=ref('')
const rules:ZtFormRules={code:[{required:true,message:'请输入验证码',trigger:'blur'},{pattern:/^\d{6}$/,message:'请输入完整的 6 位验证码',trigger:'blur'}]}
async function submit(){try{await form.value?.validate();result.value='格式校验通过，可交由业务接口验证'}catch{result.value='请补全验证码'}}
</script>
<template><ZtForm ref="form" :model="model" :rules="rules" label-position="top"><ZtFormItem label="验证码" prop="code"><ZtInputOtp v-model="model.code" /></ZtFormItem><ZtButton status="primary" @click="submit">校验格式</ZtButton><p aria-live="polite">{{result}}</p></ZtForm></template>
