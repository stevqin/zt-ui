<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const categoryOptions: ZtSelectOption[] = [
  { label: '连衣裙 Dresses', value: 'dress' },
  { label: '针织衫 Knitwear', value: 'knitwear' },
  { label: '风衣 Trench coat', value: 'trench-coat' },
  { label: '西装 Blazer', value: 'blazer' },
];
const selectedCategory = ref<string | null>(null);
</script>

<template>
  <div class="select-demo-stack">
    <ZtSelect
      v-model="selectedCategory"
      :options="categoryOptions"
      filterable
      clearable
      aria-label="商品品类"
      placeholder="输入中英文品类名"
    />
    <span>当前品类：{{ selectedCategory || '未选择' }}</span>
  </div>
</template>

<style scoped>
.select-demo-stack {
  display: grid;
  gap: 10px;
  width: min(100%, 480px);
}
.select-demo-stack > span {
  color: #6b7280;
  font-size: 13px;
}
.select-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.select-size-list {
  display: grid;
  align-items: start;
  gap: 12px;
  width: min(100%, 480px);
}
.slot-label {
  white-space: nowrap;
  color: #475569;
  font-size: 12px;
}
.slot-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.slot-option small {
  color: #64748b;
}
.slot-footer {
  color: #64748b;
  font-size: 12px;
}
.slot-tag-remove {
  border: 0;
  padding: 0 2px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
@media (max-width: 720px) {
  .select-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
