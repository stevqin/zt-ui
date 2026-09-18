<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import {
  ZtCascader,
  ZtConfigProvider,
  type ZtCascaderValue,
  type ZtTreeNode,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtCascaderValue>([]),
  dark = ref(true),
  attempts = new Set<string>();
const options: ZtTreeNode[] = [
  { id: 'mapped', title: '映射字段区域', leaf: false },
];
const fields = { key: 'id', label: 'title', children: 'nodes', isLeaf: 'leaf' };
async function load(node: ZtTreeNode): Promise<ZtTreeNode[]> {
  await Promise.resolve();
  const id = String(node.id);
  if (!attempts.has(id)) {
    attempts.add(id);
    throw new Error('首次加载失败');
  }
  return [{ id: `${id}-child`, title: '异步门店', leaf: true }];
}
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色浮层</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'" :border-radius="4"
    ><div class="pad">
      <ZtCascader
        :status="demoStatus"
        v-model="value"
        :options="options"
        :fields="fields"
        :load="load"
        clearable
        filterable
      />
      <p>{{ value }}</p>
      <ZtCascader
        :status="demoStatus"
        :options="[]"
        placeholder="空数据"
      /><ZtCascader :status="demoStatus" disabled placeholder="禁用" /></div
  ></ZtConfigProvider>
  <p>
    首次展开失败，点击重试加载。键盘 ↑ ↓ 导航当前列，→ 展开并进入下一级，←
    回到上一级。
  </p>
</template>
<style scoped>
.pad {
  padding: 16px;
  display: grid;
  gap: 12px;
}
</style>
