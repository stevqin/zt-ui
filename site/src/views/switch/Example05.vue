<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSwitchStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSwitchStatus>('primary');
const basic = ref(false);
const enabled = ref(true);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch :status="demoStatus" v-model="basic" disabled /><ZtSwitch
      :status="demoStatus"
      v-model="enabled"
      disabled
    /><ZtSwitch :status="demoStatus" v-model="basic" loading /><ZtSwitch
      :status="demoStatus"
      v-model="enabled"
      loading
    />
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
