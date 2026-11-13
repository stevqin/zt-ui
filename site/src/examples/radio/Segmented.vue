<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const period = ref('month');
const checkedPeriod = ref('month');
const reportPeriod = ref('month');
</script>

<template>
  <div class="demo">
    <ZtRadioGroup v-model="period" segmented aria-label="连体选项">
      <ZtRadio label="day">日报</ZtRadio>
      <ZtRadio label="week">周报</ZtRadio>
      <ZtRadio label="month">月报</ZtRadio>
      <ZtRadio label="quarter">季报</ZtRadio>
      <ZtRadio label="year">年报</ZtRadio>
    </ZtRadioGroup>
    <p>连体选项：{{ period }}</p>
    <ZtRadioGroup v-model="checkedPeriod" checkmark aria-label="对勾模式">
      <ZtRadio label="day">日报</ZtRadio>
      <ZtRadio label="week">周报</ZtRadio>
      <ZtRadio label="month">月报</ZtRadio>
      <ZtRadio label="quarter">季报</ZtRadio>
      <ZtRadio label="year" disabled>年报</ZtRadio>
    </ZtRadioGroup>
    <ZtRadioGroup v-model="reportPeriod" checkbox-style aria-label="方框对勾模式">
      <ZtRadio label="day">日报</ZtRadio>
      <ZtRadio label="week">周报</ZtRadio>
      <ZtRadio label="month">月报</ZtRadio>
      <ZtRadio label="quarter">季报</ZtRadio>
      <ZtRadio label="year">年报</ZtRadio>
    </ZtRadioGroup>
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
