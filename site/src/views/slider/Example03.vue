<script setup lang="ts">
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
import type { ZtSliderValue } from '@ztechjs/zt-ui';
const decimal = ref<ZtSliderValue>(0.3);
</script>

<template>
  <ZtSlider v-model="decimal" :min="0" :max="1" :step="0.1" aria-label="透明度" />
  <p>当前值：{{ decimal }}</p>
</template>
