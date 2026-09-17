<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridQueryParams,
} from '@ztechjs/zt-ui';
type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  launchDate: string;
  ownerEmail: string;
  website: string;
  sales: number;
  target: number;
};
const rows: Product[] = Array.from({ length: 37 }, (_, index) => ({
  id: index + 1,
  sku: `ZT-${String(index + 1).padStart(4, '0')}`,
  name: ['云感针织衫', '轻暖羽绒服', '通勤西装', '廓形风衣'][index % 4],
  category: ['针织', '外套', '西装', '风衣'][index % 4],
  price: [399, 899, 1299, 1599][index % 4],
  stock: 18 + ((index * 13) % 120),
  status: index % 3 === 0 ? '待补货' : '在售',
  launchDate: `2026-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')}`,
  ownerEmail: `buyer${index + 1}@example.com`,
  website: `https://example.com/products/${index + 1}`,
  sales: 30 + ((index * 17) % 210),
  target: 160 + (index % 5) * 40,
}));
const baseColumns: ZtVTableGridColumn<Product>[] = [
  { field: 'sku', title: '商品编码', width: 120, fixed: 'left' },
  {
    field: 'name',
    key: 'product-name',
    title: '商品名称',
    width: 180,
    minWidth: 150,
    sort: true,
    headerStyle: { fontWeight: 600 },
  },
  { field: 'category', title: '品类', width: 100 },
  {
    field: 'price',
    title: '零售价',
    width: 100,
    sort: true,
    formatter: ({ value }: any) => `￥${value}`,
  },
  { field: 'stock', title: '库存', width: 90, sort: true },
  { field: 'status', title: '状态', width: 90 },
];
const keyword = ref('');
const remotePage = ref(1);
const remotePageSize = ref(10);
const eventMessage = ref('事件日志会显示在这里');
const failNextQuery = ref(false);
function logEvent(name: string, detail = '') {
  eventMessage.value = `${name}${detail ? `：${detail}` : ''}`;
}
async function proxyConfig(params: ZtVTableGridQueryParams<{ keyword: string }>) {
  await new Promise((resolve) => setTimeout(resolve, 180));
  if (failNextQuery.value) {
    failNextQuery.value = false;
    throw new Error('演示请求失败');
  }
  const keywordValue = params.form.keyword.trim().toLowerCase();
  const filtered = rows.filter(
    (row) =>
      !keywordValue || `${row.sku}${row.name}${row.category}`.toLowerCase().includes(keywordValue),
  );
  const field =
    typeof params.sort.field === 'string' ? (params.sort.field as keyof Product) : undefined;
  const sorted =
    field && params.sort.order !== 'normal'
      ? [...filtered].sort((first, second) => {
          const result = String(first[field]).localeCompare(String(second[field]), 'zh-CN', {
            numeric: true,
          });
          return params.sort.order === 'asc' ? result : -result;
        })
      : filtered;
  const start = (params.page - 1) * params.pageSize;
  return { data: sorted.slice(start, start + params.pageSize), total: sorted.length };
}
async function failQuery(query: (resetPage?: boolean) => Promise<void>) {
  failNextQuery.value = true;
  await query(false);
}
</script>

<template>
  <div class="example-stack">
    <p class="example-status">{{ eventMessage }}</p>
    <ZtVTableGrid
      v-model:current-page="remotePage"
      v-model:page-size="remotePageSize"
      :columns="baseColumns"
      :proxy-config="proxyConfig"
      :form-data="{ keyword }"
      :pagination="{ pageSize: 10, pageSizes: [10, 20, 50], background: true }"
      height="380px"
      @loaded="logEvent('loaded', `${$event.total} 条`)"
      @error="logEvent('error', String($event))"
      @page-change="logEvent('page-change', `第 ${$event.currentPage} 页`)"
      @sort-change="logEvent('sort-change', `${String($event.field)} ${$event.order}`)"
    >
      <template #form="{ query, reload }">
        <div class="grid-search">
          <input
            v-model="keyword"
            placeholder="输入编码、名称或品类"
            @keyup.enter="query(true)"
          /><ZtButton status="primary" @click="query(true)">查询</ZtButton
          ><ZtButton @click="reload">重新加载</ZtButton
          ><ZtButton status="danger" @click="failQuery(query)">模拟失败</ZtButton
          ><span>第 {{ remotePage }} 页 / {{ remotePageSize }} 条</span>
        </div>
      </template>
    </ZtVTableGrid>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  width: 100%;
  gap: 10px;
}
.example-status {
  min-height: 20px;
  margin: 0;
  color: #536175;
  font-size: 13px;
}
.event-console {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 20px;
  padding: 10px 12px;
  border: 1px solid #dce6f7;
  border-radius: 10px;
  color: #52647e;
  background: #f5f8fe;
  font-size: 13px;
}
.event-console strong {
  color: #315fa8;
}
.grid-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #536175;
  font-size: 13px;
}
.grid-search {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.grid-search input {
  min-width: 240px;
  padding: 8px 12px;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  color: #293242;
  background: #fff;
  outline: none;
}
.grid-search input:focus {
  border-color: #3977eb;
  box-shadow: 0 0 0 3px rgb(57 119 235 / 12%);
}
.slot-chip {
  padding: 4px 8px;
  border-radius: 999px;
  color: #315fa8;
  background: #eaf1ff;
  font-size: 12px;
}
.empty-card {
  display: grid;
  gap: 4px;
  justify-items: center;
  color: #64748b;
}
.empty-card strong {
  color: #334155;
}
@media (max-width: 720px) {
  .grid-search input {
    min-width: 0;
    width: 100%;
  }
}
</style>
