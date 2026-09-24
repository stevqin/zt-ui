<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtButtonStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import {
  ZtCascader,
  type ZtCascaderValue,
  type ZtTreeNode,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtCascaderValue>([]),
  multiple = ref<ZtCascaderValue>([]),
  strict = ref(false);
function clearSingle() {
  value.value = null;
}
function clearMultiple() {
  multiple.value = [];
}
const options: ZtTreeNode[] = [
  {
    key: 'east',
    label: '华东',
    children: [
      {
        key: 'zj',
        label: '浙江',
        children: [
          { key: 'hz', label: '杭州' },
          { key: 'nb', label: '宁波' },
        ],
      },
      { key: 'sh', label: '上海', disabled: true },
    ],
  },
  { key: 'south', label: '华南', children: [{ key: 'gz', label: '广州' }] },
];
</script>
<template>
  <div class="stack">
    <label><input v-model="strict" type="checkbox" />允许选择任意层级</label
    ><ZtCascader
      :status="demoStatus"
      v-model="value"
      :options="options"
      :check-strictly="strict"
      filterable
      clearable
    /><ZtCascader
      :status="demoStatus"
      v-model="multiple"
      :options="options"
      :check-strictly="strict"
      multiple
      filterable
      clearable
    />
    <p>单条路径：{{ value === null ? 'null（清空）' : JSON.stringify(value) }}</p>
    <p>多条路径：{{ JSON.stringify(multiple) }}</p>
    <p>
      <button type="button" @click="clearSingle">单选清空 → null</button>
      <button type="button" @click="clearMultiple">多选清空 → []</button>
    </p>
  </div>
</template>
<style scoped>
.stack {
  display: grid;
  gap: 12px;
}
</style>
