<script setup lang="ts">
import { ZtProgress } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="progress-examples">
    <ZtProgress :percentage="100" status="success" /><ZtProgress
      :percentage="65"
      status="warning"
    /><ZtProgress :percentage="30" status="danger" />
  </div>
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
