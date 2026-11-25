<script setup lang="ts">
import { computed, ref } from 'vue';
import { ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';

const products = [
  { name: '便携水杯', category: '生活用品', color: '雾蓝', warehouse: '华东一号仓', supplier: '宁波远川', arrival: '2026-11-18' },
  { name: '帆布提袋', category: '出行用品', color: '原麻', warehouse: '华北中心仓', supplier: '杭州一川', arrival: '2026-11-19' },
  { name: '折叠雨伞', category: '出行用品', color: '炭灰', warehouse: '华南周转仓', supplier: '绍兴三和', arrival: '2026-11-20' },
  { name: '收纳托盘', category: '生活用品', color: '米白', warehouse: '华东一号仓', supplier: '苏州柏木', arrival: '2026-11-21' },
];
const rows = Array.from({ length: 60 }, (_, index) => {
  const stock = index % 7 === 0 ? 0 : 28 + index;
  return {
    ...products[index % products.length],
    id: `P${String(index + 1).padStart(3, '0')}`,
    stock,
    status: stock > 0 ? '有库存' : '待补货',
  };
});
const fewRows = ref(false);
const wideColumns = ref(true);
const limitHeight = ref(true);
const border = ref(false);
const columns = computed<ZtTableColumn[]>(() => [
  { prop: 'id', label: '编号', fixed: 'left', width: 60 },
  { prop: 'name', label: '商品', fixed: 'left', width: 100 },
  { prop: 'category', label: '分类', width: wideColumns.value ? 140 : 82 },
  { prop: 'color', label: '颜色', width: wideColumns.value ? 118 : 74 },
  { prop: 'warehouse', label: '仓库', width: wideColumns.value ? 190 : 102 },
  { prop: 'supplier', label: '供货方', width: wideColumns.value ? 180 : 100 },
  { prop: 'arrival', label: '到货日期', width: wideColumns.value ? 146 : 108 },
  { prop: 'stock', label: '库存', fixed: 'right', width: 56, align: 'right' },
  { prop: 'status', label: '库存状态', fixed: 'right', width: 82 },
]);
</script>
<template>
  <div class="table-demo">
    <div class="table-demo__controls">
      <label><input v-model="fewRows" type="checkbox" /> 少量行</label>
      <label><input v-model="wideColumns" type="checkbox" /> 加宽列</label>
      <label><input v-model="limitHeight" type="checkbox" /> 限制高度</label>
      <label><input v-model="border" type="checkbox" /> 单元格边框</label>
    </div>
    <div class="table-demo__viewport" :class="{ 'is-constrained': limitHeight }">
      <ZtTable
        :data="fewRows ? rows.slice(0, 2) : rows"
        :columns="columns"
        :max-height="limitHeight ? '100%' : undefined"
        :border="border"
        stripe
      />
    </div>
  </div>
</template>
<style scoped>
.table-demo {
  min-width: 0;
}
.table-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.table-demo__viewport.is-constrained {
  height: 45vh;
}
</style>
