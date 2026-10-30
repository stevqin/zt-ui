<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTabs, ZtTabPane } from '@ztechjs/zt-ui';
let nextId = 3;
const tabs = ref([
    { id: '1', title: '草稿 1', note: '' },
    { id: '2', title: '草稿 2', note: '' },
  ]),
  active = ref('1');
function add() {
  const id = String(nextId++);
  tabs.value.push({ id, title: `草稿 ${id}`, note: '' });
  active.value = id;
}
function remove(name: string | number) {
  if (tabs.value.length === 1) return;
  const index = tabs.value.findIndex((tab) => tab.id === name);
  if (index < 0) return;
  tabs.value.splice(index, 1);
  if (active.value === name)
    active.value = tabs.value[Math.min(index, tabs.value.length - 1)]!.id;
}
</script>
<template>
  <ZtTabs v-model="active" type="card" editable @tab-add="add" @tab-remove="remove">
    <ZtTabPane v-for="tab in tabs" :key="tab.id" :name="tab.id" :label="tab.title">
      <p>正在编辑：{{ tab.title }}</p>
      <label>
        备注
        <input v-model="tab.note" placeholder="输入草稿备注" />
      </label>
    </ZtTabPane>
  </ZtTabs>
</template>
