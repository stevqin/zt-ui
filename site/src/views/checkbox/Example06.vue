<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtCheckboxStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtCheckboxStatus>('primary');
const bordered = ref(['阅读']);
</script>

<template>
  <div class="demo-row">
    <ZtCheckboxGroup :status="demoStatus" v-model="bordered" size="small"
      ><ZtCheckbox :status="demoStatus" value="阅读" border>阅读</ZtCheckbox
      ><ZtCheckbox :status="demoStatus" value="旅行" border>旅行</ZtCheckbox
      ><ZtCheckbox :status="demoStatus" value="编程" border
        >编程</ZtCheckbox
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
