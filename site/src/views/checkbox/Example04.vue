<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtCheckboxStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtCheckboxStatus>('primary');
const statusGroup = ref(['A', 'B']);
</script>

<template>
  <div class="demo-row">
    <ZtCheckboxGroup :status="demoStatus" v-model="statusGroup"
      ><ZtCheckbox :status="demoStatus" value="A">选项 A</ZtCheckbox
      ><ZtCheckbox :status="demoStatus" value="B"
        >选项 B</ZtCheckbox
      ></ZtCheckboxGroup
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
