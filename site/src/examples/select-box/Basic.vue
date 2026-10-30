<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelectBox } from '@ztechjs/zt-ui';
const selected = ref<(string | number)[]>([]);
const options = Array.from({ length: 30 }, (_, i) => ({
  value: `P${i + 1}`,
  label: `商品 P${i + 1}`,
}));
</script>

<template>
  <div class="demo">
    <ZtSelectBox
      v-model="selected"
      :options="options"
      filterable
      clearable
      :page-size="10"
      placeholder="选择商品"
    />
    <p>已确认：{{ selected.join('、') || '无' }}</p>
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
