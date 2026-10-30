<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import {
  ZtVTableGrid,
  ZtVTableGridImportDialog,
  ZtCheckbox,
  type ZtVTableGridColumn,
} from "@ztechjs/zt-ui";
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
const records = ref<Row[]>([
  { id: 1, name: "无线键盘", brand: "品牌B", stock: 25 },
]);
const columns: ZtVTableGridColumn<Row>[] = [
  { field: "name", title: "商品", width: 180, fixed: "left", filter: true },
  { field: "brand", title: "品牌", width: 130, filter: true },
  {
    field: "stock",
    title: "库存",
    width: 120,
    sort: true,
    align: "right",
    summary: "sum",
  },
];
const open = ref(false);
const file = ref<File | null>(null);
const importing = ref(false);
const failExport = ref(false);
const result = ref("");
let alive = true;
onBeforeUnmount(() => {
  alive = false;
});
function download(text: string, filename: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
async function importFile(selected: File | null) {
  if (!selected) return;
  importing.value = true;
  try {
    const text = await selected.text();
    if (!alive) return;
    const lines = text
      .replace(/^\uFEFF/, "")
      .trim()
      .split(/\r?\n/)
      .slice(1);
    const parsed = lines.map((line, index) => {
      const [name, brand, rawStock] = line.split(",");
      const stock = Number(rawStock);
      if (!name || !brand || rawStock === undefined || !Number.isFinite(stock))
        throw new Error(`第 ${index + 2} 行格式错误`);
      return { id: Date.now() + index, name, brand, stock };
    });
    if (!parsed.length) throw new Error("文件没有数据行");
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (!alive) return;
    records.value = [...records.value, ...parsed];
    open.value = false;
    file.value = null;
    result.value = `已导入 ${parsed.length} 行`;
  } catch (error) {
    result.value = error instanceof Error ? error.message : "导入失败";
  } finally {
    importing.value = false;
  }
}
async function exportData() {
  await new Promise((resolve) => setTimeout(resolve, 650));
  if (!alive) return;
  if (failExport.value) throw new Error("模拟导出失败，请重试");
  download(
    JSON.stringify(records.value, null, 2),
    "inventory.json",
    "application/json",
  );
  result.value = "已导出 JSON";
}
function exportError(error: unknown) {
  result.value = error instanceof Error ? error.message : '导出失败';
}
</script>

<template>
  <div class="demo">
    <ZtCheckbox v-model="failExport">模拟导出失败</ZtCheckbox>
    <ZtVTableGrid
      :records="records"
      :columns="columns"
      row-key="id"
      :height="260"
      :pagination="false"
      :toolbar-config="['import', 'export']"
      :export-method="exportData"
      @import="open = true"
      @error="exportError"
    />
    <ZtVTableGridImportDialog
      v-model="open"
      v-model:file="file"
      :loading="importing"
      title="导入库存 CSV"
      template-download
      file-type-label="CSV"
      file-spec="仅支持 UTF-8 编码 .csv 文件"
      accept=".csv"
      :allowed-extensions="['csv']"
      format-hint="UTF-8 CSV，列名：name,brand,stock；数据内不包含逗号。"
      @confirm="importFile"
      @template="
        download(
          'name,brand,stock\n无线键盘,品牌B,10',
          'inventory-template.csv',
          'text/csv',
        )
      "
    />
    <p>{{ result }}</p>
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
