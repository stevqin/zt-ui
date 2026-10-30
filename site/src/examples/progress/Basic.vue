<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtProgress, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const percent = ref(40);
</script>
<template>
  <ZtProgress
    :percentage="percent"
    :status="percent === 100 ? 'success' : 'primary'"
    aria-label="库存校验进度"
  />
  <ZtSpace>
    <ZtButton @click="percent = Math.max(0, percent - 20)">减少</ZtButton>
    <ZtButton @click="percent = Math.min(100, percent + 20)">完成一批</ZtButton>
  </ZtSpace>
</template>
