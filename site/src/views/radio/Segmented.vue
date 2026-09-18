<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtRadioStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtRadioStatus>('primary');
const period = ref('month');
</script>

<template>
  <ZtRadioGroup
    v-model="period"
    segmented
    :status="demoStatus"
    aria-label="统计周期"
  >
    <ZtRadio :status="demoStatus" label="week">本周</ZtRadio>
    <ZtRadio :status="demoStatus" label="month">本月</ZtRadio>
    <ZtRadio :status="demoStatus" label="quarter">本季度</ZtRadio>
    <ZtRadio :status="demoStatus" label="year" disabled>全年</ZtRadio>
  </ZtRadioGroup>
</template>
