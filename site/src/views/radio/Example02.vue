<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio } from '@ztechjs/zt-ui';
const basic = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadio v-model="basic" label="1" disabled>禁用已选</ZtRadio
    ><ZtRadio v-model="basic" label="2" disabled>禁用未选</ZtRadio>
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
</style>
