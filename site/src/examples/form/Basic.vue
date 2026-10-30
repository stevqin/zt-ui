<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtButton,
  type ZtFormInstance,
  type ZtFormRules,
} from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>();
const model = reactive({ name: '', email: '' });
const rules: ZtFormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效邮箱' },
  ],
};
const result = ref('');
async function submit() {
  try {
    await form.value?.validate();
    result.value = '已提交';
  } catch {
    result.value = '请检查表单';
  }
}
</script>

<template>
  <div class="demo">
    <ZtForm ref="form" :model="model" :rules="rules" label-position="top">
      <ZtFormItem label="姓名" prop="name">
        <ZtInput v-model="model.name" placeholder="请输入姓名" />
      </ZtFormItem>
      <ZtFormItem label="邮箱" prop="email">
        <ZtInput v-model="model.email" placeholder="name@example.com" />
      </ZtFormItem>
    </ZtForm>
    <div>
      <ZtButton data-submit status="primary" @click="submit">提交</ZtButton>
      <ZtButton
        @click="
          form?.resetFields();
          result = '';
        "
      >
        重置
      </ZtButton>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
