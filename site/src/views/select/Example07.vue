<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const cityOptions: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
];
const sizeValue = ref('hangzhou');
</script>

<template>
  <div class="select-size-list">
    <ZtSelect
      v-model="sizeValue"
      :options="cityOptions"
      size="mini"
      aria-label="经营城市（迷你尺寸）"
    />
    <ZtSelect
      v-model="sizeValue"
      :options="cityOptions"
      size="small"
      aria-label="经营城市（小尺寸）"
    />
    <ZtSelect
      v-model="sizeValue"
      :options="cityOptions"
      size="default"
      aria-label="经营城市（默认尺寸）"
    />
    <ZtSelect
      v-model="sizeValue"
      :options="cityOptions"
      size="medium"
      aria-label="经营城市（中尺寸）"
    />
    <ZtSelect
      v-model="sizeValue"
      :options="cityOptions"
      size="large"
      aria-label="经营城市（大尺寸）"
    />
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
