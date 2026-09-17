<script setup lang="ts">
import { computed, ref } from 'vue';
import { ZtUpload } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
const files = ref<ZtUploadFile[]>([]),
  message = ref('');
// 接受新图片后只保留最后一项，旧预览由 Upload 自动释放；校验失败时保留原图。
const avatar = computed({
  get: () => files.value,
  set: (value: ZtUploadFile[]) => (files.value = value.slice(-1)),
});
</script>
<template>
  <ZtUpload
    v-model:file-list="avatar"
    accept="image/png,image/jpeg,image/webp"
    :max-size="2"
    :auto-upload="false"
    :show-file-list="false"
    @reject="(_file, reason) => (message = reason)"
    ><template #trigger="{ open, disabled }"
      ><button
        class="avatar-upload"
        type="button"
        :disabled="disabled"
        :aria-label="files.length ? '更换头像' : '选择头像'"
        @click="open"
      >
        <img v-if="files[0]?.url" :src="files[0].url" alt="当前头像" /><span
          v-else
          class="avatar-upload__empty"
          ><b>＋</b>选择头像</span
        ><span v-if="files.length" class="avatar-upload__replace">更换头像</span>
      </button></template
    ><template #tip
      >自定义 trigger；JPG / PNG / WebP，不超过 2 MB。仅本地预览，点击图片可替换。</template
    ></ZtUpload
  >
  <p aria-live="polite">{{ message }}</p>
</template>
<style scoped>
.avatar-upload {
  position: relative;
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  padding: 0;
  overflow: hidden;
  border: 1px dashed var(--zt-border);
  border-radius: var(--zt-radius, 11px);
  background: var(--zt-surface-soft);
  color: var(--zt-text-muted);
  cursor: pointer;
}
.avatar-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-upload__empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
}
.avatar-upload__empty b {
  font-size: 28px;
  font-weight: 400;
}
.avatar-upload__replace {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 7px;
  background: #172435aa;
  color: white;
  font-size: 12px;
}
.avatar-upload:focus-visible {
  outline: 2px solid var(--zt-primary, #4568d9);
  outline-offset: 3px;
}
.avatar-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
