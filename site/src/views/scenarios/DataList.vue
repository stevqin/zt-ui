<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ZtInput, ZtPagination, ZtTag } from '@ztechjs/zt-ui';
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
      <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 380px">
        <thead>
          <tr>
            <th style="padding: 12px">货号</th>
            <th>商品</th>
            <th>库存</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visible" :key="row.id" style="border-top: 1px solid #e4e9f0">
            <td style="padding: 12px">{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.stock }}</td>
            <td>
              <ZtTag :status="row.active ? 'success' : 'default'">{{
                row.active ? '已上架' : '待上架'
              }}</ZtTag>
            </td>
          </tr>
          <tr v-if="!visible.length">
            <td colspan="4" style="padding: 32px; text-align: center">
              没有匹配的商品，请调整关键词。
            </td>
          </tr>
        </tbody>
      </table>
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
