<script setup lang="ts">
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const value = ref<ZtSliderValue>(35);
</script>

<template>
  <ZtSlider v-model="value" aria-label="音量" />
  <p>当前值：{{ value }}</p>
</template>
