<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputNumber } from '@ztechjs/zt-ui';
const quantity = ref<number | null>(3);
const price = ref<number | null>(199.5);
</script>

<template>
  <div class="demo">
    <ZtInputNumber v-model="quantity" :min="1" :max="99" />
    <ZtInputNumber v-model="price" :min="0" :step="0.5" :precision="2" />
    <p>数量：{{ quantity }}，单价：{{ price }}</p>
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
