<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import {
  ZtTreeSelect,
  type ZtTreeSelectValue,
  type ZtTreeNode,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const single = ref<ZtTreeSelectValue>(null),
  multiple = ref<ZtTreeSelectValue>([]);
const data: ZtTreeNode[] = [
  {
    key: 'east',
    label: '华东',
    children: [
      { key: 'hz', label: '杭州' },
      { key: 'sh', label: '上海' },
      { key: 'nb', label: '宁波', disabled: true },
    ],
  },
  {
    key: 'south',
    label: '华南',
    children: [
      { key: 'gz', label: '广州' },
      { key: 'sz', label: '深圳' },
    ],
  },
];
</script>
<template>
  <div class="demo">
    <ZtTreeSelect
      :status="demoStatus"
      v-model="single"
      :data="data"
      filterable
      clearable
      placeholder="选择区域或门店"
    /><ZtTreeSelect
      :status="demoStatus"
      v-model="multiple"
      :data="data"
      multiple
      filterable
      clearable
      check-strategy="parent"
      :collapse-tags="1"
      placeholder="父子联动，多选"
    />
    <p>单选：{{ single }} · 多选（父节点策略）：{{ multiple }}</p>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  gap: 16px;
}
</style>
