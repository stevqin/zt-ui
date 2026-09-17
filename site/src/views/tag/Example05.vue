<script setup lang="ts">
import { ref } from 'vue';
import { ZtTag, type ZtTagStatus } from '@ztechjs/zt-ui';
const tags = ref<
  {
    label: string;
    status: ZtTagStatus;
  }[]
>([
  { label: '默认', status: 'default' },
  { label: '主要', status: 'primary' },
  { label: '成功', status: 'success' },
  { label: '警告', status: 'warning' },
]);
function removeTag(index: number) {
  tags.value.splice(index, 1);
}
</script>

<template>
  <div class="demo-row">
    <ZtTag
      v-for="(tag, index) in tags"
      :key="tag.label"
      :status="tag.status"
      closable
      @close="removeTag(index)"
      >{{ tag.label }}</ZtTag
    >
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
