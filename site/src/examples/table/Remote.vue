<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import {
  ZtTable,
  ZtPagination,
  type ZtTableColumn,
  type ZtTableSort,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const source = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `商品 ${String(i + 1).padStart(2, '0')}`,
  category: i % 2 ? '出行' : '生活',
  stock: 10 + ((i * 17) % 80),
}));
const rows = ref<typeof source>([]),
  total = ref(0),
  page = ref(1),
  loading = ref(false);
const filters = ref<Record<string, (string | number | boolean)[]>>({});
const sort = ref<ZtTableSort>({ prop: '', order: null });
const selected = ref<ZtTableKey[]>([]);
const pageSize = 6;
const columns = computed<ZtTableColumn[]>(() => [
  {
    prop: 'index',
    label: '序号',
    type: 'index',
    index: (page.value - 1) * pageSize + 1,
    width: 70,
  },
  { prop: 'name', label: '商品', width: 180 },
  {
    prop: 'category',
    label: '类别',
    filters: [
      { text: '生活', value: '生活' },
      { text: '出行', value: '出行' },
    ],
  },
  { prop: 'stock', label: '库存', sortable: true, align: 'right' },
]);
let timer: ReturnType<typeof setTimeout> | undefined;
let sequence = 0;
function request() {
  const token = ++sequence;
  clearTimeout(timer);
  loading.value = true;
  const query = {
    page: page.value,
    filters: { ...filters.value },
    sort: { ...sort.value },
  };
  // 用本地延迟模拟服务端接口，Table 的 remote 模式只发出筛选和排序事件。
  timer = setTimeout(() => {
    if (token !== sequence) return;
    const result = source.filter(
      (row) =>
        !query.filters.category?.length ||
        query.filters.category.includes(row.category),
    );
    if (query.sort.order && query.sort.prop === 'stock')
      result.sort(
        (a, b) =>
          (a.stock - b.stock) * (query.sort.order === 'ascending' ? 1 : -1),
      );
    total.value = result.length;
    rows.value = result.slice(
      (query.page - 1) * pageSize,
      query.page * pageSize,
    );
    loading.value = false;
  }, 250);
}
watch([filters, sort], () => {
  if (page.value === 1) request();
  else page.value = 1;
});
watch(page, request, { immediate: true });
onBeforeUnmount(() => {
  sequence++;
  clearTimeout(timer);
});
</script>
<template>
  <div class="table-demo">
    <p>
      远程模式由业务统一处理分页、筛选与排序；条件变化后返回第一页，稳定编号保留跨页选择。
    </p>
    <ZtTable
      :data="rows"
      :columns="columns"
      remote
      :loading="loading"
      selection
      v-model:filters="filters"
      v-model:sort="sort"
      v-model:selected-keys="selected"
    />
    <ZtPagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      :disabled="loading"
      layout="prev, pager, next, total"
    />
    <p>跨页已选：{{ selected }}</p>
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
