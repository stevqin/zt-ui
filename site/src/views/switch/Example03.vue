<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSwitchStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSwitchStatus>('primary');
const status = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch
      :status="demoStatus"
      v-model="status"
      aria-label="主题开关"
    /><span>{{ status ? '已开启' : '已关闭' }}</span>
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
