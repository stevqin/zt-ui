<script setup lang="ts">
import { ref } from 'vue';
import { ZtProgress, ZtSlider } from '@ztechjs/zt-ui';
const percent = ref(45);
</script>

<template>
  <ZtSlider
    :model-value="percent"
    @update:model-value="
      (value) => {
        if (typeof value === 'number') percent = value;
      }
    "
    aria-label="调整完成率"
  /><ZtProgress :percentage="percent" aria-label="任务完成率" />
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
