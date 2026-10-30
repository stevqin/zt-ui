<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const changed = ref('尚未调整');
const rows = [{ id: 1, name: '便携水杯', description: '适合日常随身携带' }];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品', width: 160, minWidth: 100 },
  { prop: 'description', label: '说明', width: 280, minWidth: 160 },
  { prop: 'id', label: '编号', width: 80, resizable: false },
];
</script>
<template>
  <div class="table-demo">
    <p>拖动表头右边缘，或聚焦分隔线后使用左右方向键调宽。编号列禁止调整。</p>
    <ZtTable
      :data="rows"
      :columns="columns"
      resizable
      @column-resize="(value) => (changed = `${value.prop}：${value.width}px`)"
    />
    <p>{{ changed }}</p>
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
