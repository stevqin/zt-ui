<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import {
  ZtTreeSelect,
  ZtConfigProvider,
  type ZtButtonStatus,
  type ZtTreeSelectValue,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtTreeSelectValue>(['b']);
const dark = ref(false);
const data = [
  { key: 'a', label: '区域', children: [{ key: 'b', label: '门店' }] },
];
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色状态色</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
    ><div class="statuses">
      <div>
        <p>{{ demoStatus }}</p>
        <ZtTreeSelect
          v-model="value"
          :data="data"
          :status="demoStatus"
          multiple
          clearable
          filterable
        />
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
