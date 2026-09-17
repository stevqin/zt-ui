<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtDrawer, ZtForm, ZtFormItem, ZtInput, ZtButton, ZtTag } from '@ztechjs/zt-ui';
import type { ZtFormInstance } from '@ztechjs/zt-ui';
const saved = reactive({ name: '杭州湖滨店', contact: '门店运营组' });
const draft = reactive({ ...saved }),
  open = ref(false),
  message = ref(''),
  form = ref<ZtFormInstance>();
function edit() {
  Object.assign(draft, saved);
  open.value = true;
  message.value = '';
}
async function save() {
  try {
    await form.value?.validate();
    Object.assign(saved, draft);
    open.value = false;
    message.value = '门店资料已保存（本地演示）';
  } catch {}
}
</script>
<template>
  <div>
    <ZtTag status="success">营业中</ZtTag>
    <h3 style="margin: 16px 0 8px">{{ saved.name }}</h3>
    <p>{{ saved.contact }}</p>
    <ZtButton status="primary" @click="edit">编辑门店</ZtButton>
    <p role="status" style="margin-top: 12px">{{ message }}</p>
    <ZtDrawer v-model="open" title="编辑门店" :size="440" destroy-on-close
      ><ZtForm
        ref="form"
        :model="draft"
        :rules="{ name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }] }"
        label-position="top"
        ><ZtFormItem label="门店名称" prop="name"><ZtInput v-model="draft.name" /></ZtFormItem
        ><ZtFormItem label="联系人"><ZtInput v-model="draft.contact" /></ZtFormItem></ZtForm
      ><template #footer
        ><ZtButton @click="open = false">取消</ZtButton
        ><ZtButton status="primary" @click="save">保存修改</ZtButton></template
      ></ZtDrawer
    >
  </div>
</template>
