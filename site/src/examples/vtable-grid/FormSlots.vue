<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  ZtButton,
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtSelect,
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridProxyConfig,
} from "@ztechjs/zt-ui";

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  stock: number;
}
interface SearchForm {
  keyword: string;
  category: string | null;
}

const formData = reactive<SearchForm>({ keyword: "", category: null });
const products: Product[] = [
  { id: 1, code: "SP1001", name: "纯棉圆领短袖", category: "上装", stock: 128 },
  { id: 2, code: "SP1002", name: "亚麻宽松衬衫", category: "上装", stock: 46 },
  { id: 3, code: "SP1003", name: "轻薄防风外套", category: "上装", stock: 21 },
  { id: 4, code: "SP1004", name: "运动卫衣", category: "上装", stock: 67 },
  { id: 5, code: "SP1005", name: "直筒休闲长裤", category: "下装", stock: 83 },
  { id: 6, code: "SP1006", name: "高腰牛仔长裤", category: "下装", stock: 35 },
  { id: 7, code: "SP1007", name: "棉麻阔腿裤", category: "下装", stock: 19 },
  { id: 8, code: "SP1008", name: "百褶半身裙", category: "下装", stock: 52 },
  { id: 9, code: "SP1009", name: "帆布单肩包", category: "配饰", stock: 38 },
  { id: 10, code: "SP1010", name: "编织腰带", category: "配饰", stock: 72 },
  { id: 11, code: "SP1011", name: "纯色棒球帽", category: "配饰", stock: 26 },
  { id: 12, code: "SP1012", name: "轻柔方巾", category: "配饰", stock: 54 },
];
const categories = ["上装", "下装", "配饰"].map((value) => ({
  value,
  label: value,
}));
const columns: ZtVTableGridColumn<Product>[] = [
  { field: "code", title: "商品编码", width: 140 },
  { field: "name", title: "商品名称", width: 220 },
  { field: "category", title: "品类", width: 120 },
  { field: "stock", title: "可用库存", width: 140, align: "right" },
];
const requestCount = ref(0);
const requestStatus = ref("正在加载商品");
const actionStatus = ref("勾选商品后可生成盘点清单");

const proxyConfig: ZtVTableGridProxyConfig<Product, SearchForm> = async ({
  page,
  pageSize,
  form,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const keyword = form.keyword.trim();
  const matches = products.filter(
    (product) =>
      (!keyword ||
        product.name.includes(keyword) ||
        product.code.includes(keyword)) &&
      (!form.category || product.category === form.category),
  );
  requestCount.value += 1;
  requestStatus.value = `已完成第 ${requestCount.value} 次查询，共 ${matches.length} 件商品`;
  return {
    records: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length,
  };
};

async function resetSearch(query: (resetPage?: boolean) => Promise<void>) {
  formData.keyword = "";
  formData.category = null;
  await query(true);
}

function createStocktake(rows: Product[]) {
  actionStatus.value = `已生成盘点清单：${rows.map((row) => row.name).join("、")}（共 ${rows.length} 件）`;
}
function selectedStock(rows: Product[]) {
  return rows.reduce((sum, row) => sum + row.stock, 0);
}
</script>

<template>
  <div class="demo" data-vtable-form-slots>
    <ZtVTableGrid
      :columns="columns"
      :form-data="formData"
      :proxy-config="proxyConfig"
      row-key="id"
      checkbox
      :height="320"
      :pagination="{ pageSize: 5, pageSizes: [5, 10, 20] }"
      :toolbar-config="['export', 'columnsetting']"
    >
      <template #form="{ size, query, loading, disabled }">
        <ZtForm
          :model="formData"
          :size="size"
          :disabled="disabled"
          inline
          @submit.prevent="query(true)"
        >
          <ZtFormItem label="商品" prop="keyword">
            <ZtInput
              v-model="formData.keyword"
              :size="size"
              :disabled="disabled"
              clearable
              placeholder="商品名称或编码"
              aria-label="商品名称或编码"
            />
          </ZtFormItem>
          <ZtFormItem label="品类" prop="category">
            <ZtSelect
              v-model="formData.category"
              :options="categories"
              :size="size"
              :disabled="disabled"
              clearable
              placeholder="全部品类"
              aria-label="商品品类"
              class="category-select"
            />
          </ZtFormItem>
          <ZtFormItem>
            <div class="form-actions">
              <ZtButton
                type="submit"
                status="primary"
                :size="size"
                :disabled="disabled"
                :loading="loading"
              >
                查询商品
              </ZtButton>
              <ZtButton
                :size="size"
                :disabled="disabled"
                @click="resetSearch(query)"
              >
                重置条件
              </ZtButton>
            </div>
          </ZtFormItem>
        </ZtForm>
      </template>
      <template #toolbar-left="{ selectedRows, size, disabled }">
        <ZtButton
          :size="size"
          :disabled="disabled || !selectedRows.length"
          @click="createStocktake(selectedRows)"
        >
          生成盘点清单（{{ selectedRows.length }}）
        </ZtButton>
      </template>
      <template #toolbar-right="{ reload, size, loading, disabled }">
        <ZtButton
          :size="size"
          :loading="loading"
          :disabled="disabled"
          @click="reload()"
        >
          刷新商品
        </ZtButton>
      </template>
      <template #pager-left="{ selectedCount, total }">
        <span>已选 {{ selectedCount }} 件 / 共 {{ total }} 件商品</span>
      </template>
      <template #pager-right="{ selectedRows }">
        <span>勾选库存合计：{{ selectedStock(selectedRows) }} 件</span>
      </template>
      <template #empty>
        <div class="empty-state">
          没有符合条件的商品，请调整名称或品类后重新查询
        </div>
      </template>
    </ZtVTableGrid>
    <p role="status" data-query-status>{{ requestStatus }}</p>
    <p role="status" data-action-status>{{ actionStatus }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
.category-select {
  width: 150px;
}
.form-actions {
  display: flex;
  gap: 8px;
}
.empty-state {
  padding: 24px;
  text-align: center;
}
</style>
