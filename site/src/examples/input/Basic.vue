<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput } from '@ztechjs/zt-ui';
const value = ref('');
</script>

<template>
  <div class="demo">
    <ZtInput v-model="value" clearable placeholder="搜索商品" />
    <p>当前内容：{{ value || '尚未输入' }}</p>
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
