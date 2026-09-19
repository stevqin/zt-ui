<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtButton status="primary" plain>Plain</ZtButton>
    <ZtButton status="success" dashed>Dashed</ZtButton>
    <ZtButton status="danger" text>Text</ZtButton>
    <ZtButton color="#7048e8">自定义颜色</ZtButton>
    <ZtButton color="#0f9d78" plain>自定义 Plain</ZtButton>
    <ZtButton color="#e8590c" dashed>自定义 Dashed</ZtButton>
    <ZtButton color="#7048e8" text>自定义 Text</ZtButton>
  </div>
</template>

<style scoped>
.demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
</style>
