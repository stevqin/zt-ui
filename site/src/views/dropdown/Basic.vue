<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown } from '@ztechjs/zt-ui';
import type { ZtDropdownItem } from '@ztechjs/zt-ui';
const selected = ref('未选择');
const items: ZtDropdownItem[] = [
  { key: 'group', type: 'group', label: '订单操作' },
  { key: 'edit', label: '编辑', icon: '✎' },
  { key: 'copy', label: '复制' },
  { key: 'line', type: 'divider' },
  { key: 'delete', label: '删除', disabled: true },
];
</script>
<template>
  <div class="demo-row">
    <ZtDropdown :items="items" @command="(key) => (selected = String(key))"
      >订单操作 ▾</ZtDropdown
    ><span role="status">{{ selected }}</span>
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
