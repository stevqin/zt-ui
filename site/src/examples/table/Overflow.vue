<script setup lang="ts">
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const rows = [
  {
    id: 1,
    name: '城市漫步帆布提袋',
    description: '采用耐用的帆布材质，适用于日常通勤、周末短途旅行与书籍收纳。',
  },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '商品', width: 150 },
  { prop: 'description', label: '说明', width: 240, showOverflowTooltip: true },
];
</script>
<template>
  <div class="table-demo">
    <p>
      实际溢出时显示提示；可通过鼠标悬停或键盘聚焦查看完整内容，Escape 关闭。
    </p>
    <ZtTable :data="rows" :columns="columns" />
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
