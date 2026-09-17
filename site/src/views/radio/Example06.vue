<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const sized = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup v-model="sized" size="mini"><ZtRadio label="1" border>Mini</ZtRadio></ZtRadioGroup
    ><ZtRadioGroup v-model="sized" size="small"
      ><ZtRadio label="1" border>Small</ZtRadio></ZtRadioGroup
    ><ZtRadioGroup v-model="sized" size="medium"
      ><ZtRadio label="1" border>Medium</ZtRadio></ZtRadioGroup
    ><ZtRadioGroup v-model="sized" size="large"
      ><ZtRadio label="1" border>Large</ZtRadio></ZtRadioGroup
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
