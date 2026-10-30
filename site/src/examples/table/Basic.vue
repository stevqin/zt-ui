<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTable,
  ZtButton,
  type ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const rows = ref([
  { id: 1, name: '无线键盘', stock: 25 },
  { id: 2, name: '桌面支架', stock: 80 },
  { id: 3, name: '便携鼠标', stock: 42 },
]);
const selected = ref<ZtTableKey[]>([]);
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品', fixed: 'left', width: 160 },
  { prop: 'stock', label: '库存', sortable: true, align: 'right' },
  { prop: 'operation', label: '操作', slot: 'operation', width: 120 },
];
</script>

<template>
  <div class="demo">
    <ZtTable
      :data="rows"
      :columns="columns"
      selection
      v-model:selected-keys="selected"
      stripe
      border
      resizable
      :max-height="280"
    >
      <template #operation="{ row }">
        <ZtButton @click="row.stock = Number(row.stock) + 1">补货 +1</ZtButton>
      </template>
    </ZtTable>
    <p>已选：{{ selected }}</p>
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
