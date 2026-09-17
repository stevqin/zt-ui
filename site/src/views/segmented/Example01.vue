<script setup lang="ts">
import { ref } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const period = ref('day');
const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week', disabled: true },
  { label: '月', value: 'month' },
];
</script>

<template>
  <ZtSegmented v-model="period" :options="options" />
</template>
