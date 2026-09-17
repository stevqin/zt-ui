<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTreeSelect,
  ZtConfigProvider,
  type ZtTreeSelectValue,
  type ZtTreeNode,
  type ZtComponentSize,
} from '@ztechjs/zt-ui';
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
    <label><input v-model="dark" type="checkbox" />暗色</label
    ><label><input v-model="strict" type="checkbox" />严格模式</label
    ><label><input v-model="disabled" type="checkbox" />禁用</label
    ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
      ><div class="stack">
        <ZtTreeSelect
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
