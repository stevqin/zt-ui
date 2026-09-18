<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { reactive, ref } from 'vue';
import { ZtUpload, ZtForm, ZtFormItem, ZtButton } from '@ztechjs/zt-ui';
import type { ZtUploadFile, ZtFormInstance, ZtFormRules } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const form = ref<ZtFormInstance>(),
  result = ref('');
const model = reactive({ attachments: [] as ZtUploadFile[] });
const rules: ZtFormRules = {
  attachments: {
    required: true,
    min: 1,
    message: '请至少选择一个附件',
    trigger: 'change',
  },
};
async function validate() {
  try {
    await form.value?.validate();
    result.value = '附件选择校验通过';
  } catch {
    result.value = '请选择附件';
  }
}
</script>
<template>
  <ZtForm ref="form" :model="model" :rules="rules" label-position="top"
    ><ZtFormItem prop="attachments" label="申请附件"
      ><ZtUpload
        :status="demoStatus"
        v-model:file-list="model.attachments"
        :auto-upload="false"
        multiple
        ><template #tip>此示例只校验附件选择，不执行上传。</template></ZtUpload
      ></ZtFormItem
    ><ZtButton @click="validate">校验附件</ZtButton>
    <p aria-live="polite">{{ result }}</p></ZtForm
  >
</template>
