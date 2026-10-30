<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtButton, type ZtFormInstance } from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>();
let nextId = 2;
const model = reactive({ profile: { address: { city: '杭州' } }, contacts: [{ id: 1, email: '' }] });
const result = ref('');
async function validate() {
  try { await form.value?.validate(); result.value = '所有字段验证通过'; }
  catch { result.value = '请检查城市与联系人邮箱'; }
}
</script>
<template>
  <div class="demo">
    <ZtForm ref="form" :model="model" label-position="top" @submit.prevent>
      <ZtFormItem label="城市" :prop="['profile', 'address', 'city']" :rules="{ required: true, message: '请填写城市' }"><ZtInput v-model="model.profile.address.city" /></ZtFormItem>
      <div v-for="(contact, index) in model.contacts" :key="contact.id" class="contact">
        <ZtFormItem :label="`联系人 ${index + 1} 邮箱`" :prop="`contacts.${index}.email`" :rules="[{ required: true, message: '请填写邮箱' }, { type: 'email', message: '邮箱格式不正确' }]">
          <ZtInput v-model="contact.email" />
        </ZtFormItem>
        <ZtButton :aria-label="`删除联系人 ${index + 1}`" @click="model.contacts.splice(index, 1)">删除</ZtButton>
      </div>
    </ZtForm>
    <div class="actions">
      <ZtButton @click="model.contacts.push({ id: nextId++, email: '' })">添加联系人</ZtButton>
      <ZtButton status="primary" @click="validate">校验所有字段</ZtButton>
    </div>
    <p role="status">{{ result }}</p>
    <p>prop 可用点路径或路径片段数组；规则表和表单实例方法使用规范点路径。列表使用稳定 id 作为 key，删除后索引路径随之更新。resetFields 还原每个字段挂载时的值，不负责恢复已删除的列表项。</p>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } .contact { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; } .actions { display: flex; flex-wrap: wrap; gap: 8px; } p { margin: 0; }</style>
