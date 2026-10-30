<script setup lang="ts">
import { ref } from "vue";
import {
  ZtVTableGrid,
  ZtButton,
  ZtCheckbox,
  type ZtVTableGridColumn,
  type ZtVTableGridInstance,
  type ZtVTableGridBatchSave,
  type ZtVTableGridSavePayload,
} from "@ztechjs/zt-ui";
interface Row {
  id: number;
  name: string;
  brand: string;
  stock: number;
}
const initial: Row[] = [
  { id: 1, name: "无线键盘", brand: "品牌B", stock: 25 },
  { id: 2, name: "桌面支架", brand: "品牌A", stock: 50 },
];
const records = ref<Row[]>(structuredClone(initial));
const originalRecords = ref<Row[]>(structuredClone(initial));
const grid = ref<ZtVTableGridInstance<Row>>();
const fail = ref(true);
const result = ref("");
let nextId = 3;
const columns: ZtVTableGridColumn<Row>[] = [
  { field: "name", title: "商品（双击编辑）", width: 200, editable: "text" },
  {
    field: "brand",
    title: "品牌",
    width: 150,
    editable: {
      type: "select",
      options: [
        { label: "品牌A", value: "品牌A" },
        { label: "品牌B", value: "品牌B" },
      ],
    },
  },
  {
    field: "stock",
    title: "库存",
    width: 120,
    editable: { type: "number", min: 0 },
    summary: "sum",
  },
];
function add() {
  records.value = [
    ...records.value,
    { id: nextId++, name: "新增商品", brand: "品牌A", stock: 0 },
  ];
}
function remove() {
  const keys = new Set(grid.value?.getSelectedKeys() ?? []);
  records.value = records.value.filter((row) => !keys.has(row.id));
}
const batchSave: ZtVTableGridBatchSave<Row> = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 450));
  if (fail.value) throw new Error("模拟保存失败，草稿仍保留");
  result.value = `提交：新增 ${payload.insertedRows?.length ?? 0}，删除 ${payload.deletedRows?.length ?? 0}，修改 ${payload.changes.length}`;
};
function saved(payload: ZtVTableGridSavePayload<Row>) {
  const accepted = structuredClone(payload.records ?? records.value);
  originalRecords.value = accepted;
  records.value = structuredClone(accepted);
}
async function save() {
  try {
    await grid.value?.saveChanges();
  } catch (error) {
    result.value = error instanceof Error ? error.message : "保存失败";
  }
}
async function saveFromSlot(task: () => Promise<void>) {
  try {
    await task();
  } catch (error) {
    result.value = error instanceof Error ? error.message : "保存失败";
  }
}
</script>

<template>
  <div class="demo">
    <ZtCheckbox v-model="fail" :disabled="grid?.isSaving">
      模拟保存失败（取消后可成功保存）
    </ZtCheckbox>
    <div>
      <ZtButton :disabled="grid?.isSaving" @click="add">新增草稿</ZtButton>
      <ZtButton :disabled="grid?.isSaving" @click="remove">删除所选</ZtButton>
      <ZtButton :loading="grid?.isSaving" @click="save">保存草稿</ZtButton>
      <ZtButton :disabled="grid?.isSaving" @click="grid?.cancelChanges()">
        撤销草稿
      </ZtButton>
    </div>
    <ZtVTableGrid
      ref="grid"
      v-model:records="records"
      :original-records="originalRecords"
      :columns="columns"
      row-key="id"
      :height="330"
      editable
      batch-edit
      checkbox
      :batch-save="batchSave"
      :pagination="false"
      :toolbar-config="false"
      summary-config
      @saved="saved"
      @cancel-edit="result = '已恢复保存基线'"
    >
      <template #edit-actions="{ changes, saving, save, cancel }">
        <div class="edit-controls">
          <span
            >待保存 {{ changes.changedRowCount }} 行 /
            {{ changes.changedCellCount }} 项</span
          >
          <ZtButton :disabled="saving" @click="cancel()">撤销修改</ZtButton>
          <ZtButton
            status="primary"
            :loading="saving"
            :disabled="saving"
            aria-label="提交修改"
            @click="saveFromSlot(save)"
            >提交修改</ZtButton
          >
        </div>
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
.demo p {
  margin: 0;
}
.edit-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
