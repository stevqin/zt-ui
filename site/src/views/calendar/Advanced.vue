<script setup lang="ts">
import { ref } from 'vue';
import { ZtCalendar, ZtConfigProvider } from '@ztechjs/zt-ui';
const value = ref('2026-09-17'),
  dark = ref(false);
const events: Record<string, string> = {
  '2026-09-17': '新品发布',
  '2026-09-21': '库存盘点',
  '2026-09-25': '月度复盘',
};
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
    ><ZtCalendar
      v-model="value"
      :range="['2026-09-10', '2026-09-25']"
      :disabled-date="(date) => date.getDay() === 0"
      ><template #date-cell="{ day, date, selected }"
        ><span>{{ date.getDate() }}{{ selected ? ' ✓' : '' }}</span
        ><small v-if="events[day]" class="event">{{
          events[day]
        }}</small></template
      ></ZtCalendar
    ></ZtConfigProvider
  >
  <p>可选日期限制在 9 月 10–25 日，并禁用周日。选择：{{ value }}</p>
</template>
<style scoped>
.event {
  font-size: 11px;
  line-height: 1.4;
}
</style>
