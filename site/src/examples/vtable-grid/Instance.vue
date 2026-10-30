<script setup lang="ts">
import { ref, nextTick } from 'vue';
import {
  ZtVTableGrid,
  ZtButton,
  type ZtVTableGridColumn,
  type ZtVTableGridInstance,
} from '@ztechjs/zt-ui';
interface Row {
  id: number;
  name: string;
  stock: number;
}
const grid = ref<ZtVTableGridInstance<Row>>();
const records = ref<Row[]>([
  { id: 1, name: '无线键盘', stock: 20 },
  { id: 2, name: '桌面支架', stock: 50 },
]);
const columns: ZtVTableGridColumn<Row>[] = [
  { field: 'name', title: '商品', width: 200 },
  { field: 'stock', title: '库存', width: 120 },
];
const compact = ref(false);
const result = ref('');
const busy = ref(false);
async function reload() {
  busy.value = true;
  try {
    await grid.value?.reload();
    result.value = '数据已重新加载';
  } catch (error) {
    result.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    busy.value = false;
  }
}
async function toggleWidth() {
  compact.value = !compact.value;
  await nextTick();
  grid.value?.resize();
}
function selected() {
  result.value = `已选编码：${grid.value?.getSelectedKeys().join('、') || '无'}`;
}
</script>

<template>
  <div class="demo">
    <div class="tools">
      <ZtButton :loading="busy" @click="reload">重新加载</ZtButton>
      <ZtButton @click="toggleWidth">调整容器并 resize</ZtButton>
      <ZtButton
        @click="
          grid?.setSelectedKeys([1]);
          selected();
        "
      >
        选中首行
      </ZtButton>
      <ZtButton
        @click="
          grid?.clearSelection();
          selected();
        "
      >
        清空选择
      </ZtButton>
    </div>
    <div :style="{ width: compact ? '75%' : '100%', minWidth: '300px' }">
      <ZtVTableGrid
        ref="grid"
        :records="records"
        :columns="columns"
        row-key="id"
        checkbox
        :height="240"
        :pagination="false"
        :toolbar-config="false"
        @selection-change="selected"
        @loaded="result = 'Canvas 表格已就绪'"
      />
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
  overflow-x: auto;
}
.tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
p {
  margin: 0;
}
</style>
