<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtTabsStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtTabs, ZtTabPane } from '@ztechjs/zt-ui';
import type { ZtTabName } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTabsStatus>('primary');
const cards = ref<ZtTabName>('1');
const panes = ref([
  { name: '1', label: '订单' },
  { name: '2', label: '客户' },
]);
let sequence = 2;
function add() {
  const name = String(++sequence);
  panes.value.push({ name, label: `新标签 ${name}` });
  cards.value = name;
}
function remove(name: ZtTabName) {
  const index = panes.value.findIndex((pane) => pane.name === name);
  panes.value = panes.value.filter((pane) => pane.name !== name);
  if (cards.value === name)
    cards.value =
      panes.value[Math.min(index, panes.value.length - 1)]?.name ?? '';
}
</script>
<template>
  <ZtTabs
    v-model="cards"
    type="card"
    editable
    :status="demoStatus"
    @tab-add="add"
    @tab-remove="remove"
  >
    <ZtTabPane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
      >{{ pane.label }}内容</ZtTabPane
    >
  </ZtTabs>
  <p role="status">当前标签：{{ cards || '无，请新增标签' }}</p>
</template>
