<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectRemoteMethod } from '@ztechjs/zt-ui';
const value = ref<string | null>(null);
const remoteMethod: ZtSelectRemoteMethod = async (keyword) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return Array.from({ length: 500 }, (_, index) => ({
    value: `SKU${index + 1}`,
    label: `商品 SKU${index + 1}`,
  })).filter((option) => option.label.includes(keyword));
};
</script>

<template>
  <div class="demo">
    <ZtSelect
      v-model="value"
      remote
      filterable
      virtual
      clearable
      :remote-method="remoteMethod"
      placeholder="搜索 SKU"
    />
    <p>{{ value || '未选择' }}</p>
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
