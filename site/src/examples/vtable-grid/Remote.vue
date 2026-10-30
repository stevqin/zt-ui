<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridProxyConfig,
  type ZtVTableGridFormConfig,
  type ZtVTableGridOptionLoader,
} from '@ztechjs/zt-ui';
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
interface Query {
  keyword: string;
  brand: string | null;
}
const source: Row[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `示例商品 ${i + 1}`,
  brand: i % 2 ? '品牌A' : '品牌B',
  stock: 10 + i,
}));
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'name', title: '商品', width: 180, fixed: 'left', filter: true },
  { field: 'brand', title: '品牌', width: 130, filter: true },
  {
    field: 'stock',
    title: '库存',
    width: 120,
    sort: true,
    align: 'right',
    summary: 'sum',
  },
];
const query = reactive<Query>({ keyword: '', brand: null });
const lastRequest = ref('');
const formConfig: ZtVTableGridFormConfig<Query> = {
  data: query,
  items: [
    {
      field: 'keyword',
      title: '商品',
      itemRender: {
        name: 'ZtInput',
        props: { placeholder: '搜索名称', clearable: true },
      },
    },
    {
      field: 'brand',
      title: '品牌',
      itemRender: {
        name: 'ZtSelect',
        optionSource: 'brands',
        props: { clearable: true },
      },
    },
    {
      showTitle: false,
      itemRender: {
        name: 'ZtButton',
        props: { type: 'submit', status: 'primary' },
        content: '查询',
      },
    },
    {
      showTitle: false,
      itemRender: { name: 'ZtButton', props: { type: 'reset' }, content: '重置条件' },
    },
  ],
};
const optionLoader: ZtVTableGridOptionLoader = async (name, { signal }) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (signal.aborted) throw new DOMException('取消字典查询', 'AbortError');
  return name === 'brands'
    ? [
        { value: '品牌A', label: '品牌A' },
        { value: '品牌B', label: '品牌B' },
      ]
    : [];
};
const proxyConfig: ZtVTableGridProxyConfig<Row, Query> = async ({
  page,
  pageSize,
  sort,
  form,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const matches = source.filter(
    (row) => row.name.includes(form.keyword) && (!form.brand || row.brand === form.brand),
  );
  if (sort.field === 'stock' && sort.order !== 'normal')
    matches.sort((a, b) =>
      sort.order === 'asc' ? a.stock - b.stock : b.stock - a.stock,
    );
  lastRequest.value = `第 ${page} 页，每页 ${pageSize} 条，共 ${matches.length} 条`;
  return {
    records: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length,
    summaryData: { stock: matches.reduce((sum, row) => sum + row.stock, 0) },
  };
};
</script>

<template>
  <div class="demo">
    <ZtVTableGrid
      :columns="columns"
      :proxy-config="proxyConfig"
      :form-config="formConfig"
      :option-loader="optionLoader"
      row-key="id"
      :height="350"
      :pagination="{ pageSize: 10, pageSizes: [10, 20] }"
      summary-config
      :toolbar-config="['reload', 'export', 'columnsetting']"
    />
    <p>{{ lastRequest }}</p>
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
