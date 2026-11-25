<script setup lang="ts">
import { computed, ref } from 'vue';
import { ZtButton, ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const filters = ref<Record<string, (string | number | boolean)[]>>({});
const hasFilters = computed(() =>
  Object.values(filters.value).some((values) => values.length > 0),
);
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
    filters: [
      { text: '50 元及以上', value: true },
      { text: '低于 50 元', value: false },
    ],
    filterMethod: (value, row) => (Number(row.price) >= 50) === value,
  },
];
</script>
<template>
  <div class="table-demo">
    <ZtTable :data="rows" :columns="columns" v-model:filters="filters" />
    <div class="table-demo__state">
      <ZtButton size="small" :disabled="!hasFilters" @click="filters = {}">
        清空筛选
      </ZtButton>
      <p>筛选值：{{ filters }}</p>
    </div>
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
.table-demo__state {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
