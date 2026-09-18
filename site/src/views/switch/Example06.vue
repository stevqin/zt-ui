<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSwitchStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSwitchStatus>('primary');
const custom = ref('1');
</script>

<template>
  <div class="demo-row">
    <ZtSwitch
      :status="demoStatus"
      v-model="custom"
      active-value="1"
      inactive-value="0"
      active-text="是"
      inactive-text="否"
    /><span>值：{{ custom }}</span>
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
