<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtAutocomplete,
  ZtForm,
  ZtFormItem,
  ZtButton,
  type ZtFormInstance,
} from '@ztechjs/zt-ui';
const model = reactive<{ value: string }>({ value: '' }),
  form = ref<ZtFormInstance>(),
  disabled = ref(false),
  result = ref('');
async function submit() {
  const valid = await form.value?.validate();
  result.value = valid ? '校验通过' : '请填写该字段';
}
</script>
<template>
  <div class="entry-demo">
    <label><input v-model="disabled" type="checkbox" />整个表单禁用</label
    ><ZtForm
      ref="form"
      :model="model"
      :disabled="disabled"
      size="small"
      label-position="top"
      ><ZtFormItem
        label="自动补全"
        prop="value"
        :rules="[
          { required: true, message: '请填写该字段', trigger: 'change' },
        ]"
        ><ZtAutocomplete
          v-model="model.value"
          :options="[{ value: '杭州' }, { value: '上海' }]" /></ZtFormItem
      ><ZtButton :disabled="disabled" @click="submit">校验</ZtButton></ZtForm
    >
    <p role="status">{{ result }}</p>
  </div>
</template>
<style scoped>
.entry-demo {
  display: grid;
  gap: 14px;
  width: min(100%, 480px);
}
p {
  margin: 0;
  color: var(--zt-text-secondary, #667085);
  font-size: 13px;
}
pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
