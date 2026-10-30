<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const period = ref('month');
</script>

<template>
  <div class="demo">
    <ZtRadioGroup v-model="period" segmented>
      <ZtRadio label="week">周报</ZtRadio>
      <ZtRadio label="month">月报</ZtRadio>
      <ZtRadio label="year">年报</ZtRadio>
    </ZtRadioGroup>
    <p>{{ period }}</p>
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
