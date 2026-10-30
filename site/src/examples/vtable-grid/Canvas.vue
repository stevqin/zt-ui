<script setup lang="ts">
import { h, ref } from "vue";
import {
  ZtVTableGrid,
  ZtCheckbox,
  type ZtVTableGridColumn,
} from "@ztechjs/zt-ui";
import { VTableGroup, VTableTag, VTableText } from "@ztechjs/zt-ui/vtable";
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
const records = ref<Row[]>([
  { id: 1, name: "无线键盘", brand: "品牌B", stock: 25 },
  { id: 2, name: "桌面支架", brand: "品牌A", stock: 0 },
]);
const disabled = ref(false);
const result = ref("点击商品名称或操作列中的文字。");
const columns: ZtVTableGridColumn<Row>[] = [
  {
    field: "name",
    title: "商品",
    width: 230,
    slot: "product-cell",
    headerSlot: "product-header",
  },
  {
    field: "brand",
    title: "品牌",
    width: 140,
    render: ({ value }) => h(VTableText, { text: `品牌 · ${String(value)}` }),
  },
  { field: "stock", title: "库存状态", width: 150, slot: "stock-cell" },
];
function detail(row: Row) {
  result.value = `查看商品：${row.name}（编码 ${row.id}）`;
}
function restock(row: Row) {
  records.value = records.value.map((record) =>
    record.id === row.id ? { ...record, stock: record.stock + 10 } : record,
  );
  result.value = `${row.name} 补货完成，库存 ${row.stock + 10}`;
}
</script>
<template>
  <div class="demo">
    <ZtCheckbox v-model="disabled">禁用表格</ZtCheckbox>
    <ZtVTableGrid
      :records="records"
      :columns="columns"
      row-key="id"
      :height="240"
      :pagination="false"
      :toolbar-config="false"
      :disabled="disabled"
      show-actions-column
    >
      <template #product-header="{ value }">
        <VTableText :text="`${value}（点击查看）`" :font-weight="600" />
      </template>
      <template #product-cell="{ row, value, rowIndex, disabled: locked }">
        <VTableText
          :text="`${rowIndex + 1}. ${value}`"
          :cursor="locked ? 'default' : 'pointer'"
          :opacity="locked ? 0.45 : 1"
          @pointertap="detail(row)"
        />
      </template>
      <template #stock-cell="{ value }">
        <VTableTag
          :text="Number(value) > 0 ? `有货 ${value}` : '待补货'"
          :type="Number(value) > 0 ? 'success' : 'warning'"
        />
      </template>
      <template #actions="{ row, height, disabled: locked }">
        <VTableGroup :width="88" :height="height" :opacity="locked ? 0.45 : 1">
          <VTableText
            text="补货"
            :x="0"
            :y="height / 2"
            :cursor="locked ? 'default' : 'pointer'"
            @pointertap="restock(row)"
          />
          <VTableText
            text="查看"
            :x="48"
            :y="height / 2"
            :cursor="locked ? 'default' : 'pointer'"
            @pointertap="detail(row)"
          />
        </VTableGroup>
      </template>
    </ZtVTableGrid>
    <p role="status">{{ result }}</p>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
p {
  margin: 0;
}
</style>
