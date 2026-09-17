<script setup lang="ts">
import { ZtUpload } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtUpload
    disabled
    :file-list="[{ uid: 'saved-1', name: '已归档附件.pdf', size: 12345, status: 'success' }]"
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
