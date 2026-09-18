<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtRadioStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtRadioStatus>('primary');
const group = ref('A');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup :status="demoStatus" v-model="group"
      ><ZtRadio :status="demoStatus" label="A">选项 A</ZtRadio
      ><ZtRadio :status="demoStatus" label="B">选项 B</ZtRadio
      ><ZtRadio :status="demoStatus" label="C">选项 C</ZtRadio></ZtRadioGroup
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
