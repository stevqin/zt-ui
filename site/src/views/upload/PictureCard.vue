<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="400" height="280" fill="#e7f0fb"/><circle cx="290" cy="65" r="28" fill="white"/><path d="M0 210 Q80 80 190 170 T400 130 V280 H0Z" fill="#698cc8"/><path d="M0 250 Q120 150 230 220 T400 190 V280 H0Z" fill="#698cc8" opacity=".5"/><text x="24" y="40" fill="#698cc8" font-family="sans-serif" font-size="14" letter-spacing="4">COAST</text></svg>',
  );
const demoImage2 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="400" height="280" fill="#e7f1eb"/><circle cx="290" cy="65" r="28" fill="white"/><path d="M0 210 Q80 80 190 170 T400 130 V280 H0Z" fill="#6a987e"/><path d="M0 250 Q120 150 230 220 T400 190 V280 H0Z" fill="#6a987e" opacity=".5"/><text x="24" y="40" fill="#6a987e" font-family="sans-serif" font-size="14" letter-spacing="4">FOREST</text></svg>',
  );

import { ref } from 'vue';
import { ZtUpload, ZtSwitch } from '@ztechjs/zt-ui';
import type { ZtUploadFile, ZtUploadRequestOptions } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const files = ref<ZtUploadFile[]>([
  { uid: 'coast', name: '海岸.svg', status: 'success', url: demoImage1 },
  { uid: 'forest', name: '森林.svg', status: 'success', url: demoImage2 },
]);
const disabled = ref(false),
  fail = ref(false),
  message = ref('');
const tried = new WeakSet<File>();
// 本地模拟进度，不发送网络请求。
function request(options: ZtUploadRequestOptions) {
  const shouldFail = fail.value && !tried.has(options.file);
  tried.add(options.file);
  return new Promise((resolve, reject) => {
    let percent = 0;
    const cancel = () => {
      clearInterval(timer);
      reject(new Error('已取消'));
    };
    const timer = setInterval(() => {
      percent += 10;
      options.onProgress(percent);
      if (shouldFail && percent === 50) {
        clearInterval(timer);
        options.signal.removeEventListener('abort', cancel);
        reject(new Error('模拟失败，可重试'));
        return;
      }
      if (percent === 100) {
        clearInterval(timer);
        options.signal.removeEventListener('abort', cancel);
        resolve({ mock: true });
      }
    }, 150);
    options.signal.addEventListener('abort', cancel, { once: true });
  });
}
</script>
<template>
  <div class="card-options">
    <ZtSwitch v-model="disabled" active-text="禁用上传和删除" /><ZtSwitch
      v-model="fail"
      active-text="首次模拟失败"
    />
  </div>
  <ZtUpload
    :status="demoStatus"
    v-model:file-list="files"
    list-type="picture-card"
    accept="image/*"
    multiple
    :limit="5"
    :max-size="5"
    :disabled="disabled"
    :http-request="request"
    @reject="(_file, reason) => (message = reason)"
    @exceed="message = '最多 5 张图片'"
    @error="message = '模拟失败，可在图片上重试'"
    ><template #tip
      >最多 5 张，每张 5
      MB；悬停或键盘聚焦可预览、删除，触屏直接显示操作。新图片仅模拟上传。</template
    ></ZtUpload
  >
  <p aria-live="polite">{{ message }}</p>
</template>
<style scoped>
.card-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
</style>
