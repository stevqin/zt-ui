<script setup lang="ts">
import { ref } from 'vue';
import { ZtAutocomplete, type ZtAutocompleteSource } from '@ztechjs/zt-ui';
const value = ref('');
const fetchSuggestions: ZtAutocompleteSource = async (query, signal) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (signal.aborted) return [];
  return ['DEMO001', 'DEMO002', 'ITEM003']
    .filter((code) => code.includes(query.toUpperCase()))
    .map((value) => ({ value }));
};
</script>

<template>
  <div class="demo">
    <ZtAutocomplete
      v-model="value"
      :fetch-suggestions="fetchSuggestions"
      :debounce="150"
      placeholder="搜索商品编码"
    />
    <p>已输入：{{ value }}</p>
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
