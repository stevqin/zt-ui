<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtCheckbox, ZtTreeSelect,
  ZtConfigProvider,
  type ZtTreeSelectValue,
  type ZtTreeNode,
  type ZtComponentSize, } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtTreeSelectValue>([]),
  strict = ref(false),
  disabled = ref(false),
  dark = ref(false);
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
const data: ZtTreeNode[] = [{ key: 1, label: '懒加载区域', isLeaf: false }];
async function load(node: ZtTreeNode): Promise<ZtTreeNode[]> {
  await Promise.resolve();
  return [
    { key: `${node.key}-1`, label: '新增门店', isLeaf: true },
    { key: `${node.key}-2`, label: '第二门店', isLeaf: true },
  ];
}
</script>
<template>
  <div>
    <ZtCheckbox v-model="dark">暗色</ZtCheckbox><ZtCheckbox v-model="strict">严格模式</ZtCheckbox><ZtCheckbox v-model="disabled">禁用</ZtCheckbox><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
      ><div class="stack">
        <ZtTreeSelect
          :status="demoStatus"
          v-for="size in sizes"
          :key="size"
          v-model="value"
          :size="size"
          :data="data"
          :load="load"
          :disabled="disabled"
          :check-strictly="strict"
          multiple
          clearable
          filterable
          :placeholder="size"
        /></div
    ></ZtConfigProvider>
    <p>{{ value }}</p>
  </div>
</template>
<style scoped>
.stack {
  display: grid;
  gap: 12px;
  padding: 16px;
}
</style>
