<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ZtTree, type ZtTreeNode } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const attempts = new Set<string>();
const data: ZtTreeNode[] = [
  { key: 'lazy', label: '远程节点（首次加载失败）', isLeaf: false },
];
async function load(node: ZtTreeNode): Promise<ZtTreeNode[]> {
  const key = String(node.key);
  await Promise.resolve();
  if (!attempts.has(key)) {
    attempts.add(key);
    throw new Error('模拟失败');
  }
  return [{ key: `${key}-child`, label: '重试后加载的节点', isLeaf: true }];
}
</script>
<template>
  <ZtTree :status="demoStatus" :data="data" :load="load" />
  <p>
    展开节点后点击“加载失败，重试”。实际应用中 load
    返回业务接口的节点数组；替换数据或卸载会忽略旧请求结果。
  </p>
</template>
