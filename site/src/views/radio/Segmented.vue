<script setup lang="ts">
import { ref } from 'vue'
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui'
const period = ref('month')
</script>

<template>
  <ZtRadioGroup v-model="period" segmented status="primary" aria-label="统计周期">
    <ZtRadio label="week">本周</ZtRadio>
    <ZtRadio label="month">本月</ZtRadio>
    <ZtRadio label="quarter">本季度</ZtRadio>
    <ZtRadio label="year" disabled>全年</ZtRadio>
  </ZtRadioGroup>
</template>
