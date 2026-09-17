<script setup lang="ts">
import { ref } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const value = ref(1);
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
const options = [
  { label: '一列', value: 1 },
  { label: '两列', value: 2 },
  { label: '三列', value: 3, disabled: true },
];
</script>

<template>
  <div class="example-stack">
    <ZtSegmented
      v-for="size in sizes"
      :key="size"
      v-model="value"
      :size="size"
      :options="options"
      :aria-label="`${size}列数`"
    /><ZtSegmented v-model="value" disabled :options="options" aria-label="禁用列数" />
    <p>当前列数：{{ value }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
