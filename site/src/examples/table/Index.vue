<script setup lang="ts">
import { ZtTable, ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  { id: 'a', name: '便携水杯' },
  { id: 'b', name: '帆布提袋' },
];
</script>
<template>
  <div class="table-demo">
    <p>
      分页后可将 index 设为 (页码 − 1) × 每页数量 + 1；函数可生成自定义编号。
    </p>
    <ZtTable :data="rows"
      ><ZtTableColumn
        type="index"
        label="序号"
        :index="21"
        :width="80" /><ZtTableColumn prop="name" label="商品" /><ZtTableColumn
        type="index"
        prop="code"
        label="自定义编号"
        :index="(i) => `NO-${i + 21}`"
    /></ZtTable>
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
