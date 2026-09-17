<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputNumber } from '@ztechjs/zt-ui';
const count = ref<number | null>(1);
</script>

<template>
  <div class="number-demo-row">
    <ZtInputNumber v-model="count" controls-position="default" /><ZtInputNumber
      v-model="count"
      controls-position="left"
    /><ZtInputNumber v-model="count" controls-position="right" /><ZtInputNumber
      v-model="count"
      :controls="false"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
.number-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.number-demo-row > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
