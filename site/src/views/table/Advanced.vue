<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtTable, type ZtTableColumn } from '@ztechjs/zt-ui';
const last = ref('横向滚动查看完整字段，纵向滚动时表头固定。');
const data = Array.from({ length: 20 }, (_, i) => ({
  id: `S${String(i + 1).padStart(3, '0')}`,
  name: `门店 ${i + 1}`,
  region: i % 2 ? '华东' : '华南',
  manager: ['陈经理', '李经理', '王经理'][i % 3],
  sales: 128000 + i * 8500,
  target: 200000,
  growth: `${8 + i}%`,
  address: ['杭州市上城区', '上海市静安区', '深圳市南山区'][i % 3],
}));
const columns: ZtTableColumn[] = [
  { prop: 'id', label: '门店编码', fixed: 'left', width: 110 },
  { prop: 'name', label: '门店名称', fixed: 'left', width: 140 },
  { prop: 'region', label: '区域', width: 120 },
  { prop: 'manager', label: '负责人', width: 130 },
  {
    prop: 'sales',
    label: '本月销售额',
    width: 180,
    align: 'right',
    sortable: true,
  },
  { prop: 'target', label: '销售目标', width: 160, align: 'right' },
  { prop: 'growth', label: '同比增长', width: 130, align: 'right' },
  { prop: 'address', label: '所在商圈', width: 200 },
  { prop: 'action', label: '操作', fixed: 'right', width: 100 },
];
</script>
<template>
  <div class="example">
    <ZtTable :data="data" :columns="columns" :max-height="260" border
      ><template #sales="{ value }"
        >¥{{ Number(value).toLocaleString('zh-CN') }}</template
      ><template #target="{ value }"
        >¥{{ Number(value).toLocaleString('zh-CN') }}</template
      ><template #action="{ row }"
        ><ZtButton
          text
          size="small"
          status="primary"
          @click="last = `正在查看 ${row.name}（${row.id}）`"
          >查看</ZtButton
        ></template
      ></ZtTable
    >
    <p role="status">{{ last }}</p>
    <p>
      左侧两列与右侧操作列固定；max-height 启用纵向滚动和固定表头。使用明确的
      width 计算固定列偏移。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
