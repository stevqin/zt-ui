<script setup lang="ts">
import { ref } from 'vue';
import { ZtDatePickerPanel, type ZtDatePickerValue } from '@ztechjs/zt-ui';
const value = ref<ZtDatePickerValue>('2026-09-17');
const holidays = [{ key: '2026-09-25', value: '中秋节' }];
</script>
<template>
  <div class="picker-demo">
    <ZtDatePickerPanel v-model="value" :holidays="holidays" />
    <p>已选：{{ value }}。点击标题中的年/月可切换导航视图。</p>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
