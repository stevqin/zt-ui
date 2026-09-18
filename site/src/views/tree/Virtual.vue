<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtTree, type ZtTreeKey } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const filter = ref(''),
  checked = ref<ZtTreeKey[]>([]),
  selected = ref<ZtTreeKey[]>([]);
const data = Array.from({ length: 100 }, (_, group) => ({
  key: `group-${group}`,
  label: `区域 ${group + 1}`,
  children: Array.from({ length: 100 }, (_, i) => ({
    key: `${group}-${i}`,
    label: `门店 ${group + 1}-${i + 1}`,
  })),
}));
const expanded = ref<ZtTreeKey[]>(data.map((n) => n.key));
</script>
<template>
  <div>
    <p>10,100 个节点只挂载可视窗口。End 可直接跳到最后一行。</p>
    <input
      v-model="filter"
      aria-label="筛选万级节点"
      placeholder="例如 门店 100"
    /><ZtTree
      :status="demoStatus"
      v-model:checked-keys="checked"
      v-model:selected-keys="selected"
      v-model:expanded-keys="expanded"
      :data="data"
      :filter="filter"
      virtual
      checkable
      :height="260"
      :item-height="32"
    />
    <p>已选 {{ selected }}，勾选 {{ checked.length }} 项</p>
  </div>
</template>
