<script setup lang="ts">
import { ZtRate } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo">
    <ZtRate :model-value="4.5" readonly allow-half show-score label="商品平均评分" />
    <ZtRate :model-value="3" :max="10" disabled show-score label="禁用评分" />
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
