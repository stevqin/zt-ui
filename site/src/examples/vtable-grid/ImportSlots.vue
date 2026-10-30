<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  ZtButton,
  ZtCheckbox,
  ZtVTableGrid,
  ZtVTableGridImportDialog,
  type ZtVTableGridColumn,
} from "@ztechjs/zt-ui";

interface Product {
  id: number;
  name: string;
  stock: number;
}

const records = ref<Product[]>([
  { id: 1, name: "无线键盘", stock: 25 },
  { id: 2, name: "桌面支架", stock: 12 },
]);
const columns: ZtVTableGridColumn<Product>[] = [
  { field: "name", title: "商品名称", minWidth: 160 },
  { field: "stock", title: "库存", width: 120, align: "right" },
];
const open = ref(false);
const file = ref<File | null>(null);
const fullUpload = ref(false);
const loading = ref(false);
const skipZero = ref(true);
const simulateFailure = ref(false);
const importError = ref("");
const result = ref("尚未导入商品");
let alive = true;
onBeforeUnmount(() => {
  alive = false;
});

function openImport(customUpload: boolean) {
  fullUpload.value = customUpload;
  file.value = null;
  importError.value = "";
  open.value = true;
}

function downloadTemplate() {
  const url = URL.createObjectURL(
    new Blob(["\uFEFFname,stock\n无线键盘,18\n桌面支架,0\n便携鼠标,32\n"], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "product-stock-template.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importFile(selected: File) {
  if (loading.value) return;
  loading.value = true;
  importError.value = "";
  try {
    const text = await selected.text();
    const lines = text
      .replace(/^\uFEFF/, "")
      .trim()
      .split(/\r?\n/);
    if (lines[0]?.trim() !== "name,stock")
      throw new Error("首行应为 name,stock，请使用模板。");
    const parsed = lines.slice(1).map((line, index) => {
      const cells = line.split(",");
      const name = cells[0]?.trim();
      const rawStock = cells[1]?.trim();
      const stock = Number(rawStock);
      if (
        cells.length !== 2 ||
        !name ||
        !rawStock ||
        !Number.isSafeInteger(stock) ||
        stock < 0
      ) {
        throw new Error(
          `第 ${index + 2} 行格式有误：请填写商品名称和非负整数库存。`,
        );
      }
      return { id: Date.now() + index, name, stock };
    });
    if (!parsed.length) throw new Error("文件中没有商品数据。");
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (!alive) return;
    if (simulateFailure.value)
      throw new Error(
        "本次导入失败。取消“模拟导入失败”后，可使用当前文件重试。",
      );
    const imported = skipZero.value
      ? parsed.filter((product) => product.stock > 0)
      : parsed;
    records.value = [...records.value, ...imported];
    result.value = `已导入 ${imported.length} 行，跳过 ${parsed.length - imported.length} 行零库存商品`;
    open.value = false;
    file.value = null;
  } catch (error) {
    if (alive)
      importError.value =
        error instanceof Error ? error.message : "导入失败，请重试。";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="demo">
    <div class="actions">
      <ZtButton @click="openImport(false)">自定义文件信息</ZtButton>
      <ZtButton status="primary" @click="openImport(true)"
        >自定义上传区域</ZtButton
      >
    </div>
    <ZtVTableGrid
      :records="records"
      :columns="columns"
      :height="240"
      :pagination="false"
      row-key="id"
    />
    <p aria-live="polite">{{ result }}</p>
    <ZtVTableGridImportDialog
      v-model="open"
      v-model:file="file"
      :loading="loading"
      title="导入商品库存"
      accept=".csv"
      :allowed-extensions="['csv']"
      file-type-label="CSV"
      file-spec="UTF-8 编码，列名为 name,stock"
      format-hint="UTF-8 CSV · name,stock"
      template-download
      @confirm="importFile"
      @template="downloadTemplate"
    >
      <template #title="{ title }">
        <span
          >{{ title }} ·
          {{ fullUpload ? "自定义上传区域" : "自定义文件信息" }}</span
        >
      </template>
      <template #description>
        <p>下载模板填写商品库存，导入后将追加到下方商品列表。</p>
      </template>
      <template #instructions>
        <ol class="instructions">
          <li>保留首行 name,stock；商品名称不能含逗号或换行。</li>
          <li>库存填写非负整数。可勾选跳过零库存，也可模拟失败后重试。</li>
        </ol>
      </template>
      <template #options="{ loading: busy }">
        <div class="options">
          <ZtCheckbox v-model="skipZero" :disabled="busy"
            >跳过零库存商品</ZtCheckbox
          >
          <ZtCheckbox v-model="simulateFailure" :disabled="busy"
            >模拟导入失败</ZtCheckbox
          >
        </div>
      </template>
      <template
        #template="{
          canDownloadTemplate,
          loading: busy,
          downloadTemplate: download,
        }"
      >
        <ZtButton
          text
          :disabled="busy || !canDownloadTemplate"
          @click="download"
          >下载商品模板</ZtButton
        >
      </template>
      <template
        #file="{
          file: selected,
          format,
          loading: busy,
          openFileDialog,
          removeFile,
        }"
      >
        <div class="file-details">
          <strong>{{ selected.name }}</strong>
          <small
            >{{ format }} · {{ (selected.size / 1024).toFixed(1) }} KB ·
            将追加商品库存</small
          >
          <div class="actions">
            <ZtButton :disabled="busy" @click="openFileDialog"
              >重新选择</ZtButton
            >
            <ZtButton :disabled="busy" @click="removeFile">移除文件</ZtButton>
          </div>
        </div>
      </template>
      <template
        v-if="fullUpload"
        #upload="{
          file: selected,
          dragging,
          loading: busy,
          openFileDialog,
          removeFile,
        }"
      >
        <div class="file-details custom-upload">
          <strong>{{
            dragging
              ? "松开以选择 CSV 文件"
              : selected
                ? selected.name
                : "将商品 CSV 拖到这里"
          }}</strong>
          <small>{{
            selected
              ? `${(selected.size / 1024).toFixed(1)} KB · 已就绪`
              : "也可点击按钮，使用文件选择器上传"
          }}</small>
          <div class="actions">
            <ZtButton
              :disabled="busy"
              status="primary"
              @click="openFileDialog"
              >{{ selected ? "更换 CSV 文件" : "选择 CSV 文件" }}</ZtButton
            >
            <ZtButton v-if="selected" :disabled="busy" @click="removeFile"
              >移除文件</ZtButton
            >
          </div>
        </div>
      </template>
      <template #error="{ error }">
        <p role="alert" class="error">
          文件未被接收：{{ error }}。请重新选择 CSV 文件。
        </p>
      </template>
      <template #footer="{ canConfirm, loading: busy, confirm, cancel }">
        <div class="footer">
          <p v-if="importError" role="alert" class="error">{{ importError }}</p>
          <span v-if="busy" role="status">正在读取并导入，请稍候…</span>
          <div class="actions footer-actions">
            <ZtButton :disabled="busy" @click="cancel">取消导入</ZtButton>
            <ZtButton
              status="primary"
              :disabled="!canConfirm"
              :loading="busy"
              @click="confirm"
              >{{ importError ? "重试导入" : "开始导入" }}</ZtButton
            >
          </div>
        </div>
      </template>
    </ZtVTableGridImportDialog>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}
.demo p,
.footer p {
  margin: 0;
  line-height: 1.7;
}
.actions,
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.instructions {
  margin: 0 0 16px;
  padding-left: 20px;
  line-height: 1.8;
}
.file-details {
  display: grid;
  justify-items: center;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}
.file-details strong {
  max-width: 100%;
  overflow-wrap: anywhere;
}
.custom-upload {
  padding: 12px 0;
}
.footer {
  display: grid;
  gap: 12px;
  width: 100%;
}
.footer-actions {
  justify-content: flex-end;
}
.error {
  color: var(--glass-danger-ink);
  overflow-wrap: anywhere;
}
</style>
