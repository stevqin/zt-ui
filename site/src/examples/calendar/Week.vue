<script setup lang="ts">
import { ref } from 'vue';
import { ZtCalendar, ZtButton, type ZtCalendarView } from '@ztechjs/zt-ui';
const value = ref<string | null>('2026-10-30');
const view = ref<ZtCalendarView>('week');
</script>

<template>
  <div class="demo">
    <ZtButton @click="view = view === 'week' ? 'month' : 'week'">切换月 / 周</ZtButton>
    <ZtCalendar
      v-model="value"
      v-model:view="view"
      :range="['2026-10-01', '2026-11-15']"
    />
    <p>{{ view }}：{{ value }}</p>
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
