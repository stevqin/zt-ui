<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ZtMenuItem } from '@ztechjs/zt-ui';
import { ZtMenu } from '@ztechjs/zt-ui';
const items: ZtMenuItem[] = [
  {
    key: 'work',
    label: '工作台',
    children: [
      { key: 'overview', label: '经营概览' },
      { key: 'tasks', label: '待办事项', description: '12' },
      {
        key: 'analytics',
        label: '经营分析',
        children: [
          {
            key: 'sales',
            label: '销售分析',
            children: [
              { key: 'retail', label: '门店销售' },
              { key: 'online', label: '线上销售' },
              { key: 'wholesale', label: '批发销售', disabled: true },
            ],
          },
          {
            key: 'customers',
            label: '客户分析',
            children: [
              { key: 'customer-growth', label: '客户增长' },
              { key: 'customer-retention', label: '客户留存' },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'goods',
    label: '商品管理',
    children: [
      { key: 'products', label: '商品列表' },
      {
        key: 'inventory',
        label: '库存管理',
        children: [
          { key: 'stock', label: '库存查询' },
          {
            key: 'stock-movement',
            label: '库存流水',
            children: [
              { key: 'stock-in', label: '入库记录' },
              { key: 'stock-out', label: '出库记录' },
            ],
          },
        ],
      },
    ],
  },
  { key: 'settings', label: '系统设置', disabled: true },
];
const doubleValue = ref('retail'),
  horizontalValue = ref('overview');
function selectedPath(key: string, nodes = items, parents: string[] = []): string[] {
  for (const item of nodes) {
    const path = [...parents, item.label];
    if (item.key === key) return path;
    const match = selectedPath(key, item.children ?? [], path);
    if (match.length) return match;
  }
  return [];
}
const doublePath = computed(() => selectedPath(doubleValue.value).join(' / '));
const horizontalPath = computed(() => selectedPath(horizontalValue.value).join(' / '));
</script>
<template>
  <div style="overflow: auto">
    <h4>模块双栏</h4>
    <p>四级导航：模块 → 业务分类 → 分析主题 → 功能页面。点击父菜单展开下一级。</p>
    <ZtMenu
      v-model="doubleValue"
      :items="items"
      mode="double"
      :width="360"
      :default-expanded-keys="['analytics', 'sales']"
      aria-label="双栏工作台菜单"
    />
    <p>双栏选择：{{ doublePath }}</p>
    <h4>横向导航</h4>
    <ZtMenu
      v-model="horizontalValue"
      :items="items"
      mode="horizontal"
      menu-trigger="click"
      aria-label="横向工作台菜单"
    />
    <p>横向选择：{{ horizontalPath }}</p>
  </div>
</template>
