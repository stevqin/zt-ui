<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown, ZtButton, type ZtDropdownItem } from '@ztechjs/zt-ui';
const selected = ref('暂无');
const items: ZtDropdownItem[] = [
  { key: 'group', type: 'group', label: '文件操作' },
  { key: 'copy', label: '复制' },
  { key: 'divider', type: 'divider' },
  { key: 'archive', label: '归档' },
  { key: 'remove', label: '删除', disabled: true },
];
</script>

<template>
  <div class="demo">
    <ZtDropdown :items="items" @command="selected = String($event)">
      <ZtButton>更多操作</ZtButton>
    </ZtDropdown>
    <p>命令：{{ selected }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
