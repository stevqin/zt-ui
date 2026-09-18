<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtRadioStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtRadioStatus>('primary');
const sized = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtRadioGroup :status="demoStatus" v-model="sized" size="mini"
      ><ZtRadio :status="demoStatus" label="1" border
        >Mini</ZtRadio
      ></ZtRadioGroup
    ><ZtRadioGroup :status="demoStatus" v-model="sized" size="small"
      ><ZtRadio :status="demoStatus" label="1" border
        >Small</ZtRadio
      ></ZtRadioGroup
    ><ZtRadioGroup :status="demoStatus" v-model="sized" size="medium"
      ><ZtRadio :status="demoStatus" label="1" border
        >Medium</ZtRadio
      ></ZtRadioGroup
    ><ZtRadioGroup :status="demoStatus" v-model="sized" size="large"
      ><ZtRadio :status="demoStatus" label="1" border
        >Large</ZtRadio
      ></ZtRadioGroup
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
