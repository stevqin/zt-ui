<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const filters = ref<Record<string, (string | number | boolean)[]>>({});
const rows = [
  { id: 1, name: '便携水杯', category: '生活', price: 68 },
  { id: 2, name: '帆布提袋', category: '出行', price: 32 },
  { id: 3, name: '折叠雨伞', category: '出行', price: 89 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品' },
  {
    prop: 'category',
    label: '类别',
    filters: [
      { text: '生活', value: '生活' },
      { text: '出行', value: '出行' },
    ],
  },
  {
    prop: 'price',
    label: '价格',
    sortable: true,
    filterMultiple: false,
    filters: [{ text: '50 元及以上', value: true }],
    filterMethod: (_value, row) => Number(row.price) >= 50,
  },
];
</script>
<template>
  <div class="table-demo">
    <ZtTable :data="rows" :columns="columns" v-model:filters="filters" />
    <p>筛选值：{{ filters }}</p>
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
