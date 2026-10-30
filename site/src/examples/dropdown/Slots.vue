<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown, ZtDropdownItem, ZtButton } from '@ztechjs/zt-ui';
const result = ref('');
</script>

<template>
  <div class="demo">
    <ZtDropdown @command="result = String($event)">
      <ZtButton>导出格式</ZtButton>
      <template #dropdown>
        <ZtDropdownItem command="csv" label="CSV 表格" />
        <ZtDropdownItem command="xlsx" label="Excel 工作簿" />
        <ZtDropdownItem type="divider" />
        <ZtDropdownItem command="pdf" disabled label="PDF（不可用）" />
      </template>
    </ZtDropdown>
    <p>选择：{{ result }}</p>
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
