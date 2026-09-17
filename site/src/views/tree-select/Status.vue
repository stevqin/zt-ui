<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTreeSelect,
  ZtConfigProvider,
  type ZtButtonStatus,
  type ZtTreeSelectValue,
} from '@ztechjs/zt-ui';
const statuses: ZtButtonStatus[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];
const values = ref<Record<string, ZtTreeSelectValue>>(
  Object.fromEntries(statuses.map((status) => [status, ['b']])),
);
const dark = ref(false);
const data = [
  { key: 'a', label: '区域', children: [{ key: 'b', label: '门店' }] },
];
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色状态色</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
    ><div class="statuses">
      <div v-for="status in statuses" :key="status">
        <p>{{ status }}</p>
        <ZtTreeSelect
          v-model="values[status]"
          :data="data"
          :status="status"
          multiple
          clearable
          filterable
        />
      </div></div
  ></ZtConfigProvider>
</template>
<style scoped>
.statuses {
  display: grid;
  gap: 18px;
  padding: 16px;
}
</style>
