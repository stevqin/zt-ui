<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtDatePickerPanel,
  ZtForm,
  ZtFormItem,
  ZtButton,
  type ZtFormInstance,
  type ZtDatePickerValue,
} from '@ztechjs/zt-ui';
const model = reactive<{ value: ZtDatePickerValue }>({ value: null }),
  form = ref<ZtFormInstance>(),
  disabled = ref(false),
  result = ref('');
async function submit() {
  result.value = (await form.value?.validate()) ? '校验通过' : '请填写该字段';
}
</script>
<template>
  <div class="picker-demo">
    <label><input v-model="disabled" type="checkbox" />整个表单禁用</label
    ><ZtForm
      ref="form"
      :model="model"
      :disabled="disabled"
      size="small"
      label-position="top"
      ><ZtFormItem
        label="内嵌日期面板"
        prop="value"
        :rules="[
          { required: true, message: '请填写该字段', trigger: 'change' },
        ]"
        ><ZtDatePickerPanel v-model="model.value" /></ZtFormItem
      ><ZtButton :disabled="disabled" @click="submit">校验</ZtButton></ZtForm
    >
    <p role="status">{{ result }}</p>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
