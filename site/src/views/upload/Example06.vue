<script setup lang="ts">
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtComponentSize } from '@ztechjs/zt-ui';
const sizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large'];
</script>

<template>
  <div class="upload-sizes">
    <div v-for="size in sizes" :key="size">
      <span>{{ size }}</span
      ><ZtUpload :size="size" :auto-upload="false" />
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
