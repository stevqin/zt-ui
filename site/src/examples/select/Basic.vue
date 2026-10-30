<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect } from '@ztechjs/zt-ui';
const value = ref<string | null>(null);
const multiple = ref<string[]>(['demo']);
const options = [
  { value: 'demo', label: '品牌A' },
  { value: 'brand-b', label: '品牌B' },
  { value: 'brand-c', label: '品牌C', disabled: true },
];
</script>

<template>
  <div class="demo">
    <ZtSelect
      v-model="value"
      :options="options"
      filterable
      clearable
      placeholder="选择品牌"
    />
    <ZtSelect
      v-model="multiple"
      :options="options"
      multiple
      filterable
      collapse-tags
      :max-collapse-tags="1"
    />
    <p>单选：{{ value }}；多选：{{ multiple }}</p>
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
