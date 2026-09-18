<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtRadioStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtRadioStatus>('primary');
const status = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup :status="demoStatus" v-model="status"
      ><ZtRadio :status="demoStatus" label="1">选项一</ZtRadio
      ><ZtRadio :status="demoStatus" label="2">选项二</ZtRadio></ZtRadioGroup
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
