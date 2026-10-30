<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtButton, type ZtFormInstance, type ZtFormRules } from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>();
const model = reactive({ username: '' });
const serverError = ref('');
const submitting = ref(false);
const result = ref('');
const rules: ZtFormRules = {
  username: [
    { required: true, message: '请输入账户名' },
    { validator: async (_rule, value) => {
      await new Promise(resolve => setTimeout(resolve, 250));
      return /^[a-z][a-z0-9_]{2,15}$/i.test(String(value)) || '使用 3–16 位字母、数字、下划线，以字母开头';
    } },
  ],
};
watch(() => model.username, () => { serverError.value = ''; result.value = ''; });
async function submit() {
  if (submitting.value) return;
  submitting.value = true;
  serverError.value = '';
  result.value = '';
  try {
    await form.value?.validate();
    await new Promise(resolve => setTimeout(resolve, 600));
    if (model.username.toLowerCase() === 'demo') {
      serverError.value = '该账户名已被占用，请更换';
      result.value = '服务器拒绝了本次提交';
    } else result.value = `账户 ${model.username} 已保存（模拟请求）`;
  } catch { result.value = '请先修正字段错误'; }
  finally { submitting.value = false; }
}
</script>
<template>
  <div class="demo">
    <ZtForm ref="form" :model="model" :rules="rules" :disabled="submitting" label-position="top" @submit.prevent="submit">
      <ZtFormItem label="账户名" prop="username" :error="serverError"><ZtInput v-model="model.username" placeholder="输入 demo 体验服务端错误" /></ZtFormItem>
      <ZtButton type="submit" status="primary" :loading="submitting" loading-text="正在提交">保存</ZtButton>
    </ZtForm>
    <p role="status">{{ result }}</p>
    <p>validator 支持 Promise，返回错误字符串表示失败。error 是父级持有的服务端错误；修改字段时由父级清空，clearValidate 不会清空 error 属性。提交期间禁用编辑并显示 loading，finally 恢复状态。</p>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } p { margin: 0; }</style>
