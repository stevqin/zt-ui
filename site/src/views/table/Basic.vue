<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, type ZtTableColumn, type ZtTableKey } from '@ztechjs/zt-ui';
const selected = ref<ZtTableKey[]>([]),
  expanded = ref<ZtTableKey[]>([]);
const data = [
  { id: 1, name: '杭州门店', sales: 12500, manager: '张经理' },
  { id: 2, name: '上海门店', sales: 25300, manager: '李经理' },
  { id: 3, name: '深圳门店', sales: 18600, manager: '王经理' },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', sortable: true },
  { prop: 'sales', label: '销售额', sortable: true, align: 'right' },
  { prop: 'manager', label: '负责人' },
];
</script>
<template>
  <ZtTable
    v-model:selected-keys="selected"
    v-model:expanded-keys="expanded"
    :data="data"
    :columns="columns"
    selection
    expandable
    :selectable="(row) => row.id !== 2"
    stripe
    ><template #sales="{ value }"
      >¥ {{ Number(value).toLocaleString() }}</template
    ><template #expand="{ row }"
      ><p>
        {{ row.name }}的负责人是{{ row.manager }}。这里可以放详细业务信息。
      </p></template
    ></ZtTable
  >
  <p>已选择：{{ selected }}；已展开：{{ expanded }}</p>
  <p>上海门店不可勾选；列标题按钮可循环切换升序、降序、原始顺序。</p>
</template>
