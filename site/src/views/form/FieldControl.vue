<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtButton } from '@ztechjs/zt-ui';
import type { ZtFormInstance } from '@ztechjs/zt-ui';
const form = ref<ZtFormInstance>(),
  externalError = ref(''),
  message = ref('');
const model = reactive({ contact: { email: '' } });
async function validateField() {
  try {
    await form.value?.validateField('contact.email');
    message.value = '邮箱校验通过';
  } catch {
    message.value = '请修正邮箱';
  }
}
</script>

<template>
  <div class="example-stack">
    <ZtForm ref="form" :model="model" label-width="90px"
      ><ZtFormItem
        :prop="['contact', 'email']"
        :rules="[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式错误' },
        ]"
        :error="externalError"
        ><template #label>联系邮箱</template
        ><ZtInput v-model="model.contact.email" autocomplete="email" /></ZtFormItem
    ></ZtForm>
    <div class="example-row">
      <ZtButton @click="validateField">仅校验邮箱</ZtButton
      ><ZtButton @click="externalError = '该邮箱已被使用'">模拟服务端错误</ZtButton
      ><ZtButton
        @click="
          externalError = '';
          form?.clearValidate();
        "
        >清除校验</ZtButton
      ><ZtButton
        @click="
          externalError = '';
          form?.resetFields();
        "
        >重置字段</ZtButton
      >
    </div>
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
