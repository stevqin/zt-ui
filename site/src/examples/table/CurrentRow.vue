<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, ZtButton, type ZtTableKey } from '@ztechjs/zt-ui';
const current = ref<ZtTableKey | null>(2);
const rows = [
  { id: 1, name: '便携水杯' },
  { id: 2, name: '帆布提袋' },
];
const columns = [
  { prop: 'id', label: '编号' },
  { prop: 'name', label: '商品' },
];
</script>
<template>
  <div class="table-demo">
    <ZtTable
      :data="rows"
      :columns="columns"
      highlight-current-row
      v-model:current-row-key="current"
    />
    <p>当前行：{{ current ?? '未选择' }}</p>
    <ZtButton @click="current = null">清除当前行</ZtButton>
  </div>
</template>
<style scoped>
.table-demo {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.table-demo p {
  margin: 0;
}
</style>
