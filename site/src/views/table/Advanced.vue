<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTable,
  ZtConfigProvider,
  type ZtTableColumn,
  type ZtTableSort,
} from '@ztechjs/zt-ui';
const loading = ref(false),
  dark = ref(false),
  remote = ref(false),
  last = ref('未排序');
const data = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `门店 ${i + 1}`,
  region: i % 2 ? '华东' : '华南',
  sales: 1000 * (30 - i),
  growth: `${i}%`,
  action: '查看',
}));
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '固定门店', fixed: 'left', width: 140 },
  { prop: 'region', label: '区域', width: 160 },
  { prop: 'sales', label: '销售', sortable: true, width: 160 },
  { prop: 'growth', label: '增长', width: 160 },
  { prop: 'action', label: '操作', fixed: 'right', width: 100 },
];
function sort(value: ZtTableSort) {
  last.value = JSON.stringify(value);
}
</script>
<template>
  <div>
    <label><input v-model="loading" type="checkbox" />加载中</label
    ><label><input v-model="dark" type="checkbox" />暗色</label
    ><label><input v-model="remote" type="checkbox" />服务端排序</label
    ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
      ><ZtTable
        :data="data"
        :columns="columns"
        :loading="loading"
        :remote="remote"
        :max-height="260"
        border
        @sort-change="sort"
        ><template #action="{ row }"
          ><button type="button" @click="last = `查看 ${row.name}`">
            查看
          </button></template
        ></ZtTable
      ></ZtConfigProvider
    >
    <p>事件：{{ last }}</p>
    <p>启用服务端模式后数据顺序由调用方更新；sort-change 提供字段和方向。</p>
  </div>
</template>
