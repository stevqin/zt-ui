<script setup lang="ts">
import { reactive } from 'vue';
import { ZtButton, ZtForm, ZtFormItem, ZtInput, ZtInputNumber } from '@ztechjs/zt-ui';
const search = reactive({ keyword: '', limit: 10 });
</script>

<template>
  <ZtForm :model="search" inline size="small"
    ><ZtFormItem label="关键词"
      ><ZtInput v-model="search.keyword" placeholder="商品名称" /></ZtFormItem
    ><ZtFormItem label="数量"><ZtInputNumber v-model="search.limit" /></ZtFormItem
    ><ZtFormItem><ZtButton status="primary">查询</ZtButton></ZtFormItem></ZtForm
  >
</template>

<style scoped>
.form-demo {
  width: min(100%, 520px);
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.form-actions span {
  color: #6b7280;
  font-size: 12px;
}
.form-layout-grid,
.form-size-grid {
  display: grid;
  gap: 12px;
  width: min(100%, 520px);
}
.form-group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 720px) {
  .form-group-grid {
    grid-template-columns: 1fr;
  }
}
</style>
