<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal } from '@ztechjs/zt-ui';
const visible = ref(false);
const padding = ref<number | string>();
const options: { label: string; value: number | string | undefined }[] = [
  { label: '默认内边距', value: undefined },
  { label: '零内边距', value: 0 },
  { label: '24px 内边距', value: 24 },
  { label: '自定义内边距', value: '12px 32px' },
];
function open(value: number | string | undefined) {
  padding.value = value;
  visible.value = true;
}
</script>

<template>
  <div class="padding-options">
    <ZtButton v-for="option in options" :key="option.label" @click="open(option.value)">
      {{ option.label }}
    </ZtButton>
  </div>
  <ZtModal v-model="visible" title="正文内边距" :body-padding="padding" show-footer @confirm="visible = false">
    <div class="padding-preview">
      <span>body-padding：{{ padding === undefined ? '未传（使用默认值）' : padding }}</span>
    </div>
  </ZtModal>
</template>

<style scoped>
.padding-options { display: flex; flex-wrap: wrap; gap: 10px; }
.padding-preview {
  display: grid;
  place-items: center;
  min-height: 140px;
  background: var(--zt-surface-soft, #f1f5f9);
  color: var(--zt-text-muted, #64748b);
}
</style>
