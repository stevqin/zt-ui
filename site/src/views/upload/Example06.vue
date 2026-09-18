<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
</script>

<template>
  <div class="upload-sizes">
    <div v-for="size in sizes" :key="size">
      <span>{{ size }}</span
      ><ZtUpload :status="demoStatus" :size="size" :auto-upload="false" />
    </div>
  </div>
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
