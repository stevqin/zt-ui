<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  ZtButton,
  ZtInput,
  ZtSelect,
  ZtVTableGrid,
  type ZtVTableGridColumn,
  type ZtVTableGridFormConfig,
  type ZtVTableGridProxyConfig,
} from "@ztechjs/zt-ui";

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  stock: number;
}

interface Query {
  keyword: string;
  category: string | null;
  brand: string | null;
}

const query = reactive<Query>({
  keyword: "衬衫",
  category: null,
  brand: "品牌A",
});
const resultText = ref("正在加载商品…");
const categoryOptions = [
  { label: "上装", value: "上装" },
  { label: "下装", value: "下装" },
];
const source: Product[] = [
  { id: 1, name: "棉质衬衫", category: "上装", brand: "品牌A", stock: 128 },
  { id: 2, name: "条纹衬衫", category: "上装", brand: "品牌A", stock: 86 },
  { id: 3, name: "亚麻衬衫", category: "上装", brand: "品牌B", stock: 42 },
  { id: 4, name: "休闲长裤", category: "下装", brand: "品牌A", stock: 75 },
  { id: 5, name: "直筒长裤", category: "下装", brand: "品牌B", stock: 64 },
  { id: 6, name: "运动卫衣", category: "上装", brand: "品牌B", stock: 39 },
];
const columns: ZtVTableGridColumn<Product>[] = [
  { field: "name", title: "商品名称", minWidth: 140 },
  { field: "category", title: "品类", width: 90 },
  { field: "brand", title: "品牌", width: 90 },
  { field: "stock", title: "库存", width: 90, align: "right" },
];
const formConfig: ZtVTableGridFormConfig<Query> = {
  items: [
    {
      field: "keyword",
      title: "商品",
      rules: { required: true, message: "请输入商品关键词", trigger: "blur" },
      slots: { default: "productField" },
    },
    {
      field: "category",
      title: "品类",
      slots: { default: "categoryField" },
    },
    {
      field: "brand",
      title: "品牌",
      rules: { required: true, message: "请选择品牌", trigger: "change" },
      itemRender: {
        name: "ZtSelect",
        props: {
          clearable: true,
          placeholder: "请选择品牌",
          style: { width: "130px" },
        },
        options: [
          { label: "品牌A", value: "品牌A" },
          { label: "品牌B", value: "品牌B" },
        ],
      },
    },
    { showTitle: false, slots: { default: "queryActions" } },
  ],
};
const proxyConfig: ZtVTableGridProxyConfig<Product, Query> = async ({
  form,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const records = source.filter(
    (product) =>
      product.name.includes(form.keyword.trim()) &&
      (!form.category || product.category === form.category) &&
      (!form.brand || product.brand === form.brand),
  );
  resultText.value = `本次查询返回 ${records.length} 件商品`;
  return { records, total: records.length };
};
</script>

<template>
  <div class="demo">
    <p>
      商品和品类使用字段插槽，品牌使用配置控件。清空商品或品牌后查询可查看校验，重置可恢复初始条件。
    </p>
    <ZtVTableGrid
      :columns="columns"
      :form-config="formConfig"
      :form-data="query"
      :proxy-config="proxyConfig"
      :height="420"
      :pagination="false"
      row-key="id"
    >
      <template #productField="{ data, size, disabled, loading }">
        <ZtInput
          v-model="(data as Query).keyword"
          class="keyword-field"
          :size="size"
          :disabled="disabled || loading"
          placeholder="输入商品关键词"
          clearable
        />
      </template>
      <template #categoryField="{ data, size, disabled, loading }">
        <ZtSelect
          v-model="(data as Query).category"
          class="category-field"
          :options="categoryOptions"
          :size="size"
          :disabled="disabled || loading"
          placeholder="全部品类"
          clearable
        />
      </template>
      <template #queryActions="{ size, disabled, loading }">
        <div class="query-actions">
          <ZtButton
            type="submit"
            status="primary"
            :size="size"
            :disabled="disabled || loading"
            :loading="loading"
            >查询商品</ZtButton
          >
          <ZtButton type="reset" :size="size" :disabled="disabled || loading"
            >重置</ZtButton
          >
        </div>
      </template>
    </ZtVTableGrid>
    <p aria-live="polite">{{ resultText }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}
.demo p {
  margin: 0;
  line-height: 1.7;
}
.keyword-field {
  width: 150px;
}
.category-field {
  width: 120px;
}
.query-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
