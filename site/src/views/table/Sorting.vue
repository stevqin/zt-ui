<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtTag,
  ZtTable,
  type ZtTableColumn,
  type ZtTableSort,
} from '@ztechjs/zt-ui';
const sort = ref<ZtTableSort>({ prop: 'sales', order: null });
const data = [
  { id: 1, name: '杭州旗舰店', sales: 12500, growth: 12 },
  { id: 2, name: '上海静安店', sales: 25300, growth: 8 },
  { id: 3, name: '深圳中心店', sales: 18600, growth: 20 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', sortable: true },
  {
    prop: 'sales',
    label: '销售额',
    sortable: true,
    align: 'right',
    formatter: (value) => `¥${Number(value).toLocaleString('zh-CN')}`,
  },
  {
    prop: 'growth',
    label: '同比增长',
    sortable: true,
    align: 'right',
    formatter: (value) => `${value}%`,
  },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <span>销售额排序</span
      ><ZtButton
        size="small"
        :status="
          sort.prop === 'sales' && sort.order === 'ascending'
            ? 'primary'
            : 'default'
        "
        @click="sort = { prop: 'sales', order: 'ascending' }"
        >升序</ZtButton
      ><ZtButton
        size="small"
        :status="
          sort.prop === 'sales' && sort.order === 'descending'
            ? 'primary'
            : 'default'
        "
        @click="sort = { prop: 'sales', order: 'descending' }"
        >降序</ZtButton
      ><ZtButton size="small" @click="sort = { prop: 'sales', order: null }"
        >清除排序</ZtButton
      >
    </div>
    <ZtTable v-model:sort="sort" :data="data" :columns="columns" />
    <div class="state" role="status">
      <ZtTag :status="sort.order ? 'primary' : 'default'">{{
        sort.order === 'ascending'
          ? '升序'
          : sort.order === 'descending'
            ? '降序'
            : '未排序'
      }}</ZtTag
      ><code>{{ sort.prop }} / {{ sort.order ?? 'null' }}</code>
    </div>
    <p>
      点击表头按“未排序 → 升序 → 降序 →
      未排序”循环。未排序时上、下箭头均为灰色；升序时上箭头高亮，降序时下箭头高亮，另一个方向弱化。也可通过
      v-model:sort 外部控制。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
.controls,
.state {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
p,
code {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
