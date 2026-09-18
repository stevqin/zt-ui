<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="400" height="280" fill="#f6ebdb"/><circle cx="290" cy="65" r="28" fill="white"/><path d="M0 210 Q80 80 190 170 T400 130 V280 H0Z" fill="#bf9163"/><path d="M0 250 Q120 150 230 220 T400 190 V280 H0Z" fill="#bf9163" opacity=".5"/><text x="24" y="40" fill="#bf9163" font-family="sans-serif" font-size="14" letter-spacing="4">DUNES</text></svg>',
  );

import { ref } from 'vue';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const pictures = ref<ZtUploadFile[]>([
  { uid: 'dunes', name: '沙丘.svg', status: 'success', url: demoImage1 },
]);
const pictureMessage = ref('');
</script>

<template>
  <ZtUpload
    :status="demoStatus"
    v-model:file-list="pictures"
    accept="image/*"
    list-type="picture"
    :auto-upload="false"
    multiple
    :limit="4"
    :max-size="5"
    @reject="(_file, reason) => (pictureMessage = reason)"
    @exceed="pictureMessage = '最多选择 4 张图片'"
    ><template #tip
      >选择图片后点击缩略图预览，单张不超过 5 MB。</template
    ></ZtUpload
  >
  <p aria-live="polite">{{ pictureMessage }}</p>
</template>

<style scoped>
.upload-sizes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.upload-sizes > div {
  display: flex;
  align-items: center;
  gap: 16px;
}
.upload-sizes > div > span {
  width: 70px;
  flex: none;
  color: var(--zt-text-muted);
  font-size: 12px;
}
</style>
