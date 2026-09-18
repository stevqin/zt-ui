<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtMenuStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtMenu } from '@ztechjs/zt-ui';
import type { ZtMenuItem } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtMenuStatus>('primary');
const nested = ref('orders');
const expanded = ref(['business']);
const tree: ZtMenuItem[] = [
  { key: 'home', label: '工作台' },
  {
    key: 'business',
    label: '业务管理',
    children: [
      { key: 'orders', label: '订单' },
      {
        key: 'products',
        label: '商品',
        children: [
          { key: 'stock', label: '库存' },
          { key: 'pricing', label: '价格' },
        ],
      },
    ],
  },
  {
    key: 'system',
    label: '系统设置',
    children: [
      { key: 'users', label: '用户' },
      { key: 'roles', label: '角色' },
    ],
  },
];
</script>

<template>
  <ZtMenu
    :status="demoStatus"
    v-model="nested"
    v-model:expanded-keys="expanded"
    :items="tree"
    accordion
    aria-label="业务导航"
    style="max-width: 300px"
  />
  <p>当前选择：{{ nested }}</p>
</template>

<style scoped>
.menu-palettes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.menu-palettes p {
  margin: 0 0 6px !important;
}
@media (max-width: 600px) {
  .menu-palettes {
    grid-template-columns: 1fr;
  }
}
</style>
