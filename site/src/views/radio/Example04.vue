<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const status = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup v-model="status" status="primary"
      ><ZtRadio label="1">Primary</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup
    >
  </div>
  <div class="demo-row">
    <ZtRadioGroup v-model="status" status="success"
      ><ZtRadio label="1">Success</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup
    >
  </div>
  <div class="demo-row">
    <ZtRadioGroup v-model="status" status="danger"
      ><ZtRadio label="1">Danger</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup
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
