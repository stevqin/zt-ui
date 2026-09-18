<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtUploadFile, ZtUploadRequestContext } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const files = ref<ZtUploadFile[]>([]),
  message = ref('');
// 本地模拟业务接口；项目中可直接替换为同签名的 Axios 封装方法。
async function uploadAttachment(
  data: FormData,
  context: ZtUploadRequestContext,
) {
  const file = data.get('attachment') as File;
  message.value = `收到 FormData：${file.name}，目录 ${data.get('folder')}`;
  for (let progress = 20; progress <= 100; progress += 20) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (context.signal.aborted) throw new DOMException('已取消', 'AbortError');
    context.onProgress(progress);
  }
  return { id: file.name, uploaded: true };
}
</script>

<template>
  <div class="example-stack">
    <ZtUpload
      :status="demoStatus"
      v-model:file-list="files"
      :request="uploadAttachment"
      name="attachment"
      :data="{ folder: 'documents' }"
      multiple
      @success="message = '业务接口成功返回，文件状态已更新'"
    />
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
