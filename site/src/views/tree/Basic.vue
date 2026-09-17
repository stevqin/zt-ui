<script setup lang="ts">
import { ref } from 'vue';
import { ZtTree, type ZtTreeNode, type ZtTreeKey } from '@ztechjs/zt-ui';
const checked = ref<ZtTreeKey[]>([]),
  selected = ref<ZtTreeKey[]>([]),
  expanded = ref<ZtTreeKey[]>(['east']),
  filter = ref(''),
  strict = ref(false);
const data: ZtTreeNode[] = [
  {
    key: 'east',
    label: '华东区域',
    children: [
      { key: 'hz', label: '杭州门店' },
      { key: 'sh', label: '上海门店' },
      { key: 'closed', label: '停业门店', disabled: true },
    ],
  },
  {
    key: 'south',
    label: '华南区域',
    children: [{ key: 'sz', label: '深圳门店' }],
  },
];
</script>
<template>
  <div class="demo">
    <label>筛选节点 <input v-model="filter" placeholder="搜索门店" /></label
    ><label><input v-model="strict" type="checkbox" />严格勾选</label
    ><ZtTree
      v-model:checked-keys="checked"
      v-model:selected-keys="selected"
      v-model:expanded-keys="expanded"
      :data="data"
      :filter="filter"
      :check-strictly="strict"
      checkable
      ><template #default="{ node }"
        ><span>{{ node.label }}</span></template
      ></ZtTree
    >
    <p>勾选：{{ checked }} · 选择：{{ selected }}</p>
    <p>
      聚焦树后使用 ↑ ↓ / Home / End 导航，← → 展开收起，空格勾选，Enter 选择。
    </p>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  gap: 12px;
  max-width: 600px;
}
.demo input:not([type='checkbox']) {
  padding: 6px;
}
</style>
