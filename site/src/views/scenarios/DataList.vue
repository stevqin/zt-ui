<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ZtInput, ZtPagination, ZtTag, ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const columns: ZtTableColumn[] = [
  {prop: 'id', label: '货号', minWidth: 100},
  {prop: 'name', label: '商品', minWidth: 120},
  {prop: 'stock', label: '库存', width: 80},
  {prop: 'active', label: '状态', width: 100},
];
const keyword = ref(''),
  page = ref(1),
  pageSize = ref(5);
const rows = Array.from({ length: 23 }, (_, i) => ({
  id: `SP${String(i + 1).padStart(3, '0')}`,
  name: ['轻薄衬衫', '通勤外套', '直筒长裤'][i % 3]!,
  stock: 18 + i * 3,
  active: i % 3 !== 0,
}));
const filtered = computed(() =>
  rows.filter((r) => (r.id + r.name).toLowerCase().includes(keyword.value.toLowerCase())),
);
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
);
watch([keyword, pageSize], () => (page.value = 1));
</script>
<template>
  <div>
    <ZtInput
      v-model="keyword"
      placeholder="搜索商品名或货号"
      aria-label="搜索商品"
      clearable
      style="max-width: 300px"
    />
    <div style="overflow-x: auto; margin: 16px 0">
      <ZtTable :data="visible" :columns="columns" empty-text="没有匹配的商品，请调整关键词。">
        <template #active="{ row }">
          <ZtTag :status="row.active ? 'success' : 'default'">{{ row.active ? '已上架' : '待上架' }}</ZtTag>
        </template>
      </ZtTable>
    </div>
    <ZtPagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="filtered.length"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next"
      background
    />
  </div>
</template>
