<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const storeOptions: ZtSelectOption[] = [
  { label: '杭州大厦店', value: 'hz-tower' },
  { label: '上海港汇店', value: 'sh-grand-gateway' },
  { label: '北京国贸店', value: 'bj-skpmall' },
  { label: '深圳万象城店', value: 'sz-mixc' },
];
const selectedStores = ref<Array<string | number | boolean>>(['hz-tower', 'sh-grand-gateway']);
</script>

<template>
  <div class="select-demo-stack">
    <ZtSelect
      v-model="selectedStores"
      :options="storeOptions"
      multiple
      filterable
      clearable
      aria-label="活动门店"
      placeholder="选择参与活动的门店"
    />
    <span>已选 {{ selectedStores.length }} 家门店</span>
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
