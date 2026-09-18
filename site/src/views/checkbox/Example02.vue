<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtCheckboxStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtCheckbox } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtCheckboxStatus>('primary');
const checked = ref(true);
const unchecked = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtCheckbox :status="demoStatus" v-model="checked" disabled
      >禁用已选</ZtCheckbox
    ><ZtCheckbox :status="demoStatus" v-model="unchecked" disabled
      >禁用未选</ZtCheckbox
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
