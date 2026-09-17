<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const bordered = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup v-model="bordered" size="small"
      ><ZtRadio label="1" border>选项一</ZtRadio
      ><ZtRadio label="2" border>选项二</ZtRadio></ZtRadioGroup
    >
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
