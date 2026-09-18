<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import {
  ZtTransfer,
  ZtConfigProvider,
  type ZtButtonStatus,
  type ZtTransferKey,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtTransferKey[]>(['b']);
const dark = ref(false);
const data = [
  { key: 'a', label: '待授权' },
  { key: 'b', label: '已授权' },
];
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色状态色</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
    ><div class="statuses">
      <div>
        <p>{{ demoStatus }}</p>
        <ZtTransfer v-model="value" :data="data" :status="demoStatus" />
      </div></div
  ></ZtConfigProvider>
</template>
<style scoped>
.statuses {
  display: grid;
  gap: 18px;
  padding: 16px;
}
</style>
