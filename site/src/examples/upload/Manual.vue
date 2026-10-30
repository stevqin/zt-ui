<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtUpload,
  ZtButton,
  type ZtUploadFile,
  type ZtUploadRequest,
} from '@ztechjs/zt-ui';
const upload = ref<InstanceType<typeof ZtUpload>>();
const files = ref<ZtUploadFile[]>([]);
const hint = ref('');
const beforeUpload = async (file: File) => {
  if (file.size === 0) {
    hint.value = '不能上传空文件';
    return false;
  }
  return true;
};
const httpRequest: ZtUploadRequest = async (options) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (options.signal.aborted) throw new DOMException('取消上传', 'AbortError');
  options.onProgress(100);
  return { filename: options.file.name };
};
</script>

<template>
  <div class="demo">
    <ZtUpload
      ref="upload"
      v-model:file-list="files"
      :auto-upload="false"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
      multiple
    >
      <span>选择待上传文件</span>
    </ZtUpload>
    <div>
      <ZtButton @click="upload?.submit()">开始上传</ZtButton>
      <ZtButton @click="upload?.abort()">取消请求</ZtButton>
      <ZtButton @click="upload?.clearFiles()">清空</ZtButton>
    </div>
    <p>{{ hint }} 待处理：{{ files.length }}</p>
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
