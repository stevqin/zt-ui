<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { ZtUpload } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
</script>

<template>
  <ZtUpload
    :status="demoStatus"
    disabled
    :file-list="[
      {
        uid: 'saved-1',
        name: '已归档附件.pdf',
        size: 12345,
        status: 'success',
      },
    ]"
  />
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
