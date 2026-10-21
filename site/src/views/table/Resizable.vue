<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtCheckbox,
  ZtTable,
  ZtTag,
  type ZtTableColumn,
  type ZtTableColumnResize,
} from '@ztechjs/zt-ui';
const resizable = ref(true),
  resetKey = ref(0);
const last = ref('拖动表头列边框调宽；也可聚焦边框后使用左右方向键。');
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', width: 180, minWidth: 100, fixed: 'left' },
  { prop: 'region', label: '区域', width: 140, minWidth: 80 },
  { prop: 'sales', label: '销售额', width: 180, minWidth: 100, sortable: true },
  {
    prop: 'growth',
    label: '同比增长',
    width: 160,
    minWidth: 100,
    sortable: true,
  },
  {
    prop: 'owner',
    label: '负责人（锁定列宽）',
    width: 180,
    fixed: 'right',
    resizable: false,
  },
];
const rows = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: ['杭州旗舰店', '上海静安店', '深圳中心店', '南京新街口店'][index % 4],
  region: index % 3 === 2 ? '华南' : '华东',
  sales: 320000 + index * 18500,
  growth: 8 + index * 2,
  owner: ['陈经理', '李经理', '王经理'][index % 3],
}));
function resized(value: ZtTableColumnResize) {
  const column = columns.find((column) => column.prop === value.prop);
  last.value = `${column?.label}列已调整为 ${value.width}px`;
}
</script>
<template>
  <div class="resize-example">
    <div class="controls">
      <ZtCheckbox v-model="resizable">允许调整列宽</ZtCheckbox
      ><ZtButton
        size="small"
        @click="
          resetKey++;
          last = '已恢复默认列宽';
        "
        >恢复默认列宽</ZtButton
      >
    </div>
    <ZtTable
      :key="resetKey"
      :data="rows"
      :columns="columns"
      :resizable="resizable"
      :max-height="280"
      border
      @column-resize="resized"
    >
      <template #sales="{ value }"
        >¥{{ Number(value).toLocaleString('zh-CN') }}</template
      >
      <template #growth="{ value }">+{{ value }}%</template>
    </ZtTable>
    <div class="event" role="status">
      <ZtTag size="small" status="info">列宽反馈</ZtTag><span>{{ last }}</span>
    </div>
    <p>
      minWidth 设置拖动下限；单列 resizable=false
      可锁定。列边框悬停时高亮，拖动不触发排序，固定列会同步更新位置。调宽完成后通过
      column-resize 获取 prop 和 width，可由业务保存。
    </p>
  </div>
</template>
<style scoped>
.resize-example {
  display: grid;
  gap: 16px;
}
.controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.event {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--zt-border, #dcdfe6);
  border-radius: var(--zt-radius, 8px);
  background: var(--zt-surface-soft, #f5f7fa);
  font-size: 12px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #909399);
  font-size: 12px;
  line-height: 1.7;
}
</style>
