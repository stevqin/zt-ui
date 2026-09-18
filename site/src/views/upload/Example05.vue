<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const limited = ref<ZtUploadFile[]>([]);
const limitMessage = ref('');
</script>

<template>
  <ZtUpload
    :status="demoStatus"
    v-model:file-list="limited"
    drag
    multiple
    accept=".pdf,.txt"
    :limit="2"
    :max-size="2"
    :auto-upload="false"
    @reject="(_file, reason) => (limitMessage = reason)"
    @exceed="limitMessage = '最多两个文件，本次选择已取消'"
    ><template #tip
      >仅支持 PDF / TXT，最多两个，每个不超过 2 MB。仅本地选择。</template
    ></ZtUpload
  >
  <p aria-live="polite">{{ limitMessage }}</p>
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
