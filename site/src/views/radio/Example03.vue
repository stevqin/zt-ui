<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const group = ref('A');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup v-model="group"
      ><ZtRadio label="A">选项 A</ZtRadio><ZtRadio label="B">选项 B</ZtRadio
      ><ZtRadio label="C">选项 C</ZtRadio></ZtRadioGroup
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
