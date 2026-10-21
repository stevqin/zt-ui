<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown } from '@ztechjs/zt-ui';
import type { ZtDropdownItem } from '@ztechjs/zt-ui';
const selected = ref('未选择');
const items: ZtDropdownItem[] = [
  { key: 'edit', label: '编辑订单' },
  { key: 'copy', label: '复制订单' },
];
</script>
<template>
  <div class="demo-row">
    <ZtDropdown :items="items" @command="(command) => (selected = String(command))">
      自定义菜单内容
      <template #item="{ item }">
        <span class="item-content">
          <span>{{ item.label }}</span>
          <kbd>{{ item.key === 'edit' ? '⌘ E' : '⌘ C' }}</kbd>
        </span>
      </template>
    </ZtDropdown>
    <span role="status">{{ selected }}</span>
  </div>
</template>
<style scoped>
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.item-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; width: 100%; }
kbd { color: var(--zt-muted, #626262); font: inherit; font-size: .85em; }
</style>
