<script setup lang="ts">
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
const range = ref<[number, number]>([100, 500]);
</script>

<template>
  <div class="demo">
    <ZtSlider
      v-model="range"
      range
      :min="0"
      :max="1000"
      :step="50"
      aria-label="价格范围"
    />
    <p>价格：{{ range[0] }}–{{ range[1] }} 元</p>
    <ZtSlider :model-value="30" disabled aria-label="只读进度" />
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
