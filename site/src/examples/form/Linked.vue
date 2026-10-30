<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import {
  ZtForm,
  ZtFormItem,
  ZtFormGroup,
  ZtPassword,
  ZtButton,
  ZtSwitch,
  type ZtFormInstance,
  type ZtFormRules,
} from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>();
const model = reactive({ password: '', confirmation: '' });
const disabled = ref(false);
const result = ref('');
const rules: ZtFormRules = {
  password: [{ required: true, min: 6, message: '密码至少六位' }],
  confirmation: [
    { required: true, message: '请确认密码' },
    {
      validator: async (_rule, value, data) => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return value === data.password || '两次密码不一致';
      },
    },
  ],
};
watch(
  () => model.password,
  () => {
    if (model.confirmation)
      void form.value?.validateField('confirmation').catch(() => {});
  },
);
async function submit() {
  try {
    await form.value?.validate();
    result.value = '验证通过';
  } catch {
    result.value = '请修正错误';
  }
}
</script>

<template>
  <div class="demo">
    <ZtSwitch v-model="disabled" active-text="禁用整表" />
    <ZtForm
      ref="form"
      :model="model"
      :rules="rules"
      :disabled="disabled"
      underline
      label-position="top"
    >
      <ZtFormGroup title="账户安全" description="密码至少六位">
        <ZtFormItem label="密码" prop="password">
          <ZtPassword v-model="model.password" />
        </ZtFormItem>
        <ZtFormItem label="确认密码" prop="confirmation">
          <ZtPassword v-model="model.confirmation" />
        </ZtFormItem>
      </ZtFormGroup>
    </ZtForm>
    <ZtButton @click="submit" :disabled="disabled">验证</ZtButton>
    <p>{{ result }}</p>
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
