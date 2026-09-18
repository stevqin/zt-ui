<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtMenuStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtMenu } from '@ztechjs/zt-ui';
import type { ZtMenuItem } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtMenuStatus>('primary');
const selected = ref('overview');
const items: ZtMenuItem[] = [
  {
    key: 'workspace',
    label: '工作空间',
    type: 'group',
    children: [
      { key: 'overview', label: '概览', description: 'Overview' },
      { key: 'reports', label: '报表', description: 'Reports' },
      { key: 'archive', label: '归档', disabled: true },
    ],
  },
  {
    key: 'admin',
    label: '管理',
    type: 'group',
    children: [
      { key: 'members', label: '成员' },
      { key: 'settings', label: '设置' },
    ],
  },
];
</script>

<template>
  <ZtMenu
    :status="demoStatus"
    v-model="selected"
    :items="items"
    aria-label="工作空间导航"
    style="max-width: 300px"
  />
  <p>当前选择：{{ selected }}</p>
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
