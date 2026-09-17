<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtButton,
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtInputNumber,
  ZtPassword,
  type ZtFormInstance,
  type ZtFormRules,
} from '@ztechjs/zt-ui';
const formRef = ref<ZtFormInstance>();
const submitState = ref('尚未提交');
const account = reactive({ name: '', email: '', password: '', quantity: 1 });
const accountRules: ZtFormRules = {
  name: [
    { required: true, trigger: 'blur', message: '请输入名称' },
    { min: 2, max: 20, trigger: 'change', message: '名称长度为 2 到 20 个字符' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', trigger: ['blur', 'change'], message: '邮箱格式不正确' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, trigger: 'change', message: '密码至少 6 个字符' },
  ],
  quantity: { type: 'number', min: 1, message: '数量至少为 1' },
};
async function submitAccount() {
  try {
    await formRef.value?.validate();
    submitState.value = '校验通过';
  } catch {
    submitState.value = '请修正表单内容';
  }
}
function resetAccount() {
  formRef.value?.resetFields();
  submitState.value = '已重置';
}
</script>

<template>
  <ZtForm
    ref="formRef"
    :model="account"
    :rules="accountRules"
    label-width="88px"
    scroll-to-error
    class="form-demo"
    ><ZtFormItem label="名称" prop="name"
      ><ZtInput
        v-model="account.name"
        name="username"
        autocomplete="username"
        clearable
        placeholder="请输入名称" /></ZtFormItem
    ><ZtFormItem label="邮箱" prop="email"
      ><ZtInput
        v-model="account.email"
        name="email"
        autocomplete="email"
        placeholder="name@example.com" /></ZtFormItem
    ><ZtFormItem label="密码" prop="password"
      ><ZtPassword v-model="account.password" name="password" /></ZtFormItem
    ><ZtFormItem label="数量" prop="quantity"
      ><ZtInputNumber v-model="account.quantity" :min="0" /></ZtFormItem
    ><ZtFormItem
      ><div class="form-actions">
        <ZtButton status="primary" @click="submitAccount">提交</ZtButton
        ><ZtButton @click="resetAccount">重置</ZtButton><span>{{ submitState }}</span>
      </div></ZtFormItem
    ></ZtForm
  >
</template>

<style scoped>
.form-demo {
  width: min(100%, 520px);
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.form-actions span {
  color: #6b7280;
  font-size: 12px;
}
.form-layout-grid,
.form-size-grid {
  display: grid;
  gap: 12px;
  width: min(100%, 520px);
}
.form-group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 720px) {
  .form-group-grid {
    grid-template-columns: 1fr;
  }
}
</style>
