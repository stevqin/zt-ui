<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtUploadStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtUpload, ZtButton } from '@ztechjs/zt-ui';
import type { ZtUploadFile } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtUploadStatus>('primary');
const files = ref<ZtUploadFile[]>([]);
const upload = ref<InstanceType<typeof ZtUpload>>();
</script>

<template>
  <div class="example-stack">
    <ZtButton @click="upload?.clearFiles()">清空列表</ZtButton
    ><ZtUpload
      :status="demoStatus"
      ref="upload"
      v-model:file-list="files"
      :auto-upload="false"
      multiple
      ><template #file="{ file, remove }"
        ><div class="example-row">
          <strong>{{ file.name }}</strong
          ><span>{{ file.status }}</span
          ><ZtButton size="mini" @click="remove">移除</ZtButton>
        </div></template
      ></ZtUpload
    >
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
