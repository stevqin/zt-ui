<script setup lang="ts">
import { ref } from 'vue';
import { ZtUpload, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
const files = ref<ZtUploadFile[]>([]),
  protect = ref(true),
  message = ref('');
async function beforeUpload(file: File) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const allowed = !file.name.includes('拒绝');
  message.value = allowed ? '前置校验通过' : '文件名含“拒绝”，不允许加入';
  return allowed;
}
async function beforeRemove() {
  message.value = protect.value ? '请关闭删除保护后重试' : '已允许删除';
  return !protect.value;
}
</script>

<template>
  <div class="example-stack">
    <ZtSwitch v-model="protect" active-text="保护文件不被删除" /><ZtUpload
      v-model:file-list="files"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      multiple
      ><template #tip
        >选择名称包含“拒绝”的文件可验证拒绝分支。本示例不发送请求。</template
      ></ZtUpload
    >
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
