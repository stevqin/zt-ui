<script setup lang="ts">
import { reactive } from 'vue';
import { ZtInputTag, type ZtEntryStatus } from '@ztechjs/zt-ui';
const statuses: ZtEntryStatus[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];
const values = reactive<string[][]>([
  ['设计'],
  ['设计'],
  ['设计'],
  ['设计'],
  ['设计'],
  ['设计'],
]);
</script>
<template>
  <div class="status-demo">
    <div v-for="(status, i) in statuses" :key="status">
      <p>{{ status }}</p>
      <ZtInputTag v-model="values[i]" :status="status" />
    </div>
  </div>
</template>
<style scoped>
.status-demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
p {
  margin: 0 0 6px;
  font-size: 13px;
}
</style>
