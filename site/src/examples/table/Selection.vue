<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, type ZtTableKey } from '@ztechjs/zt-ui';
const multiple = ref<ZtTableKey[]>([]),
  single = ref<ZtTableKey[]>([]);
const rows = [
  { id: 'A', name: '便携水杯', available: true },
  { id: 'B', name: '帆布提袋', available: false },
  { id: 'C', name: '折叠雨伞', available: true },
];
const columns = [
  { prop: 'id', label: '编号' },
  { prop: 'name', label: '商品' },
];
</script>
<template>
  <div class="table-demo">
    <p>多选，帆布提袋不可选。稳定 rowKey 可保留跨页选择。</p>
    <ZtTable
      :data="rows"
      :columns="columns"
      selection
      v-model:selected-keys="multiple"
      :selectable="(row) => Boolean(row.available)"
    />
    <p>已选：{{ multiple }}</p>
    <p>单选</p>
    <ZtTable
      :data="rows"
      :columns="columns"
      selection
      selection-type="radio"
      v-model:selected-keys="single"
    />
    <p>已选：{{ single }}</p>
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
