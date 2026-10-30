<script setup lang="ts">
import { ref } from 'vue';
import { ZtTransfer, type ZtTransferKey, type ZtTransferOption } from '@ztechjs/zt-ui';
const value = ref<ZtTransferKey[]>([]);
const data = [
  { key: 1, label: '杭州旗舰店', code: 'HZ001' },
  { key: 2, label: '上海旗舰店', code: 'SH001' },
];
const filterMethod = (query: string, option: ZtTransferOption) =>
  `${option.label} ${option.code}`.toLowerCase().includes(query.toLowerCase());
</script>

<template>
  <div class="demo">
    <ZtTransfer v-model="value" :data="data" filterable :filter-method="filterMethod" />
    <p>可搜索 HZ001 或杭州；当前：{{ value }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
