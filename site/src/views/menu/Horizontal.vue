<script setup lang="ts">
import { ref } from 'vue';
import { ZtMenu, ZtSelect } from '@ztechjs/zt-ui';
import type { ZtMenuItem, ZtMenuStatus } from '@ztechjs/zt-ui';
const selected = ref('overview'),
  trigger = ref<'hover' | 'click'>('hover'),
  status = ref<ZtMenuStatus>('primary');
const items: ZtMenuItem[] = [
  { key: 'overview', label: '工作台' },
  {
    key: 'business',
    label: '业务中心',
    children: [
      {
        key: 'trade',
        label: '交易管理',
        type: 'group',
        children: [
          { key: 'orders', label: '订单中心' },
          { key: 'refunds', label: '退款售后' },
        ],
      },
      {
        key: 'reports',
        label: '数据报表',
        children: [
          { key: 'daily', label: '日报' },
          { key: 'monthly', label: '月报' },
        ],
      },
    ],
  },
  {
    key: 'team',
    label: '组织管理',
    children: [
      { key: 'members', label: '成员管理' },
      { key: 'roles', label: '角色权限' },
    ],
  },
  { key: 'disabled', label: '高级功能', disabled: true },
];
</script>
<template>
  <div class="horizontal-controls">
    <ZtSelect
      v-model="trigger"
      :options="[
        { label: '悬停展开', value: 'hover' },
        { label: '点击展开', value: 'click' },
      ]"
      aria-label="横向菜单触发方式"
      size="small"
    /><ZtSelect
      v-model="status"
      :options="
        ['default', 'primary', 'success', 'warning', 'danger', 'info'].map((value) => ({
          label: value,
          value,
        }))
      "
      aria-label="横向菜单主题"
      size="small"
    />
  </div>
  <ZtMenu
    v-model="selected"
    mode="horizontal"
    :items="items"
    :menu-trigger="trigger"
    :status="status"
    aria-label="横向业务导航"
  />
  <p>当前选择：{{ selected }}</p>
</template>
<style scoped>
.horizontal-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.horizontal-controls > * {
  width: 150px;
}
</style>
