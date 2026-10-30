<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const period = ref('日');
const amounts: Record<string, string> = { 日: '¥8,600', 周: '¥42,800', 月: '¥128,600' };
</script>
<template>
  <ZtSegmented v-model="period" :options="['日', '周', '月']" aria-label="统计周期" />
  <p>本{{ period }}销售额：{{ amounts[period] }}</p>
</template>
