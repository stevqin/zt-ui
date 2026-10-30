<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtButton, type ZtFormInstance, type ZtFormRules } from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>();
const model = reactive({ name: '初始姓名', email: '' });
const result = ref('');
const rules: ZtFormRules = {
  name: { required: true, message: '请填写姓名' },
  email: [{ required: true, message: '请填写邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
};
async function validateEmail() {
  try { await form.value?.validateField('email'); result.value = '邮箱验证通过'; }
  catch (errors) { result.value = `邮箱验证失败：${JSON.stringify(errors)}`; }
}
function resetName() { form.value?.resetFields('name'); result.value = '姓名已还原为挂载时的初值'; }
function clearErrors() { form.value?.clearValidate(['name', 'email']); result.value = '仅清除提示，字段值保持不变'; }
</script>
<template>
  <div class="demo">
    <ZtForm ref="form" :model="model" :rules="rules" label-position="top" scroll-to-error @submit.prevent>
      <ZtFormItem label="姓名" prop="name"><ZtInput v-model="model.name" /></ZtFormItem>
      <ZtFormItem label="邮箱" prop="email"><ZtInput v-model="model.email" /></ZtFormItem>
    </ZtForm>
    <div class="actions">
      <ZtButton status="primary" @click="validateEmail">仅校验邮箱</ZtButton>
      <ZtButton @click="resetName">仅重置姓名</ZtButton>
      <ZtButton @click="clearErrors">清除校验提示</ZtButton>
      <ZtButton @click="form?.scrollToField('email')">滚动到邮箱</ZtButton>
    </div>
    <p role="status">{{ result }}</p>
    <p>validate / validateField 成功返回 Promise&lt;true&gt;，失败 reject 字段到错误消息数组的映射，调用时需捕获。实例方法接收规范点路径字符串或其数组；scrollToField 仅接收一个字符串。resetFields 省略参数时重置全部已挂载字段，clearValidate 不修改值。</p>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } .actions { display: flex; flex-wrap: wrap; gap: 8px; } p { margin: 0; overflow-wrap: anywhere; }</style>
