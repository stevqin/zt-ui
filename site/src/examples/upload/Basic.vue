<script setup lang="ts">
import { ref } from 'vue';
import { ZtUpload, type ZtUploadFile, type ZtUploadSubmitRequest } from '@ztechjs/zt-ui';
const files = ref<ZtUploadFile[]>([]);
const attempts = new WeakSet<File>();
const result = ref('');
const request: ZtUploadSubmitRequest = async (_data, context) => {
  for (const progress of [25, 60, 100]) {
    await new Promise((resolve) => setTimeout(resolve, 180));
    if (context.signal.aborted) throw new DOMException('已取消', 'AbortError');
    context.onProgress(progress);
  }
  if (!attempts.has(context.file)) {
    attempts.add(context.file);
    throw new Error('模拟网络中断，请重试');
  }
  result.value = '上传完成';
  return { id: context.file.name };
};
</script>

<template>
  <div class="demo">
    <ZtUpload
      v-model:file-list="files"
      :request="request"
      accept=".csv,.txt"
      :max-size="2"
      :limit="3"
      multiple
      drag
    >
      <span>选择或拖入 CSV / TXT 文件</span>
    </ZtUpload>
    <p>{{ result || '每个文件首次上传会模拟失败' }}</p>
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
