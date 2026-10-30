<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const view = ref('grid');
const options = [
  { label: '网格', value: 'grid', icon: 'menu' as const },
  { label: '列表', value: 'list', icon: 'checklist' as const },
  { label: '图表', value: 'chart', icon: 'chart' as const, disabled: true },
];
</script>
<template>
  <ZtSegmented v-model="view" :options="options" block aria-label="商品展示方式" />
  <div :class="view">
    <div v-for="name in ['机械键盘', '无线键盘', '桌面支架']" :key="name" class="product">
      {{ name }}
    </div>
  </div>
</template>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}
.product {
  padding: 20px;
  border: 1px solid #8884;
}
</style>
