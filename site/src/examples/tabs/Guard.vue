<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTabs, ZtTabPane } from '@ztechjs/zt-ui';
const active = ref('edit'),
  saved = ref(false),
  message = ref('保存后才能离开编辑页');
function guard(next: string | number, previous: string | number) {
  if (previous === 'edit' && !saved.value) {
    message.value = '请先保存草稿，再切换到预览';
    return false;
  }
  message.value = `已切换到 ${next}`;
  return true;
}
</script>
<template>
  <label>
    <input v-model="saved" type="checkbox" />
    草稿已保存
  </label>
  <ZtTabs v-model="active" type="island" :before-leave="guard">
    <ZtTabPane name="edit" label="编辑草稿">编辑内容区域</ZtTabPane>
    <ZtTabPane name="preview" label="预览">已保存的草稿预览</ZtTabPane>
  </ZtTabs>
  <p role="status">{{ message }}</p>
</template>
