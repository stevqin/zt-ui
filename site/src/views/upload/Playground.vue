<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import { ZtUpload, ZtButton, ZtSwitch } from '@ztechjs/zt-ui';
import type {
  ZtUploadFile,
  ZtUploadRequestOptions,
  ZtUploadStatus,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const upload = ref<InstanceType<typeof ZtUpload>>(),
  files = ref<ZtUploadFile[]>([]);
const auto = ref(true),
  drag = ref(false),
  failFirst = ref(false),
  notice = ref('');
const attempted = new WeakSet<File>();
// 本地模拟：不创建网络请求，不会发送文件。生产环境可使用 action 替换此函数。
function request(options: ZtUploadRequestOptions) {
  const fail = failFirst.value && !attempted.has(options.file);
  attempted.add(options.file);
  return new Promise((resolve, reject) => {
    let percent = 0;
    const cancel = () => {
      clearInterval(timer);
      reject(new Error('已取消'));
    };
    const timer = setInterval(() => {
      percent += 10;
      options.onProgress(percent);
      if (fail && percent >= 50) {
        clearInterval(timer);
        options.signal.removeEventListener('abort', cancel);
        reject(new Error('模拟连接失败，请点击重试'));
        return;
      }
      if (percent >= 100) {
        clearInterval(timer);
        options.signal.removeEventListener('abort', cancel);
        resolve({ name: options.file.name, mock: true });
      }
    }, 180);
    options.signal.addEventListener('abort', cancel, { once: true });
  });
}
</script>
<template>
  <div class="upload-controls">
    <ZtSwitch v-model="auto" active-text="自动上传" /><ZtSwitch
      v-model="drag"
      active-text="拖拽区域"
    /><ZtSwitch v-model="failFirst" active-text="首次模拟失败" />
  </div>
  <ZtUpload
    ref="upload"
    v-model:file-list="files"
    :auto-upload="auto"
    :drag="drag"
    :status="demoStatus"
    :http-request="request"
    multiple
    :limit="3"
    :max-size="5"
    @exceed="notice = '最多选择 3 个文件，本次选择已取消'"
    @reject="(_file, reason) => (notice = reason)"
    @success="notice = '本地模拟上传完成'"
    @error="notice = '模拟失败，可使用列表中的重试按钮'"
  >
    <template #tip
      >本地模拟上传，不发送文件。最多 3 个文件，每个不超过 5 MB。</template
    >
  </ZtUpload>
  <div class="upload-actions">
    <ZtButton
      v-if="!auto"
      size="small"
      status="primary"
      @click="upload?.submit()"
      >开始上传</ZtButton
    ><ZtButton
      size="small"
      :disabled="!files.some((file) => file.status === 'uploading')"
      @click="upload?.abort()"
      >取消全部上传</ZtButton
    ><ZtButton
      size="small"
      :disabled="!files.length"
      @click="
        upload?.clearFiles();
        notice = '';
      "
      >清空列表</ZtButton
    >
  </div>
  <p class="upload-notice" aria-live="polite">{{ notice }}</p>
</template>
<style scoped>
.upload-controls {
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.upload-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.upload-notice {
  font-size: 13px;
  color: var(--zt-text-muted);
}
</style>
