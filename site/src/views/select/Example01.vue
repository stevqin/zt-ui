<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const cityOptions: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
];
const selectedCity = ref('hangzhou');
const emptyCity = ref('');
const nullCity = ref<string | null>(null);
</script>

<template>
  <div class="select-demo-stack">
    <ZtSelect
      v-model="selectedCity"
      :options="cityOptions"
      clearable
      aria-label="经营城市"
      placeholder="选择经营城市"
    />
    <ZtSelect
      v-model="emptyCity"
      :options="cityOptions"
      clearable
      aria-label="空字符串城市"
      placeholder="请选择城市（空字符串）"
    />
    <ZtSelect
      v-model="nullCity"
      :options="cityOptions"
      clearable
      aria-label="null 城市"
      placeholder="请选择城市（null）"
    />
    <span>当前城市：{{ selectedCity || '未选择' }}</span>
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
