<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown, ZtDropdownItem } from '@ztechjs/zt-ui';
const selected = ref('未选择');
</script>
<template>
  <div class="demo-row">
    <ZtDropdown @command="(command) => (selected = String(command))">
      订单操作
      <template #dropdown>
        <ZtDropdownItem type="group" label="订单操作" />
        <ZtDropdownItem command="edit" label="编辑订单" icon="✎" />
        <ZtDropdownItem command="copy" label="复制订单">
          <span class="item-content">
            <span>复制订单</span><kbd>⌘ C</kbd>
          </span>
        </ZtDropdownItem>
        <ZtDropdownItem type="divider" />
        <ZtDropdownItem command="export" label="导出订单">
          <span class="item-content"><span>导出订单</span><small>CSV</small></span>
        </ZtDropdownItem>
        <ZtDropdownItem command="delete" disabled>删除订单（无权限）</ZtDropdownItem>
      </template>
    </ZtDropdown>
    <span role="status">{{ selected }}</span>
  </div>
</template>
<style scoped>
.demo-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.item-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
kbd, small { color: var(--zt-muted, #626262); font: inherit; font-size: .85em; }
</style>
