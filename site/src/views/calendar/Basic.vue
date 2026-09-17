<script setup lang="ts">
import { ref } from 'vue';
import { ZtCalendar, type ZtCalendarView } from '@ztechjs/zt-ui';
const value = ref('2026-10-01'),
  view = ref<ZtCalendarView>('month');
const holidays = [
  { key: '2026-10-01', value: '国庆节' },
  { key: '2026-10-02', value: '假期' },
];
</script>
<template>
  <ZtCalendar v-model="value" v-model:view="view" :holidays="holidays" />
  <p>当前选择：{{ value }} · {{ view === 'month' ? '月' : '周' }}视图</p>
  <p>
    方向键移动日期，Home / End 移到周首尾，PageUp / PageDown 切换月，Enter
    选定日期。
  </p>
</template>
