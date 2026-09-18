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
    <ZtCheckboxGroup :status="demoStatus" v-model="bordered" size="mini"
      ><ZtCheckbox :status="demoStatus" value="阅读" border
        >Mini</ZtCheckbox
      ></ZtCheckboxGroup
    ><ZtCheckboxGroup :status="demoStatus" v-model="bordered" size="small"
      ><ZtCheckbox :status="demoStatus" value="阅读" border
        >Small</ZtCheckbox
      ></ZtCheckboxGroup
    ><ZtCheckboxGroup :status="demoStatus" v-model="bordered" size="medium"
      ><ZtCheckbox :status="demoStatus" value="阅读" border
        >Medium</ZtCheckbox
      ></ZtCheckboxGroup
    ><ZtCheckboxGroup :status="demoStatus" v-model="bordered" size="large"
      ><ZtCheckbox :status="demoStatus" value="阅读" border
        >Large</ZtCheckbox
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
