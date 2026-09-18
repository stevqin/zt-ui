<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSegmentedStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSegmentedStatus>('primary');
const period = ref('day');
const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week', disabled: true },
  { label: '月', value: 'month' },
];
</script>

<template>
  <ZtSegmented :status="demoStatus" v-model="period" :options="options" />
</template>
