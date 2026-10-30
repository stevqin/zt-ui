<script setup lang="ts">
import { ref } from 'vue';
import { ZtCalendar } from '@ztechjs/zt-ui';
const value = ref<string | null>('2026-10-30');
</script>

<template>
  <div class="demo">
    <ZtCalendar v-model="value" :holidays="[{ key: '2026-10-01', value: '国庆节' }]">
      <template #date-cell="{ day }">
        <span>{{ day.slice(-2) }}</span>
        <small v-if="day === '2026-10-30'">订货会</small>
      </template>
    </ZtCalendar>
    <p>所选日期：{{ value }}</p>
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
