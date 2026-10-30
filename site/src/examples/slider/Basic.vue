<script setup lang="ts">
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
const value = ref(40);
</script>

<template>
  <div class="demo">
    <ZtSlider
      v-model="value"
      :step="5"
      :format-tooltip="(value) => `${value}%`"
      aria-label="完成比例"
    />
    <p>完成比例：{{ value }}%</p>
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
