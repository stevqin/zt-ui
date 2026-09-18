<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import {
  ZtTree,
  ZtConfigProvider,
  type ZtButtonStatus,
  type ZtTreeKey,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtButtonStatus>('primary');
const value = ref<ZtTreeKey[]>(['a']);
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
        <ZtTree
          v-model:checked-keys="value"
          :data="data"
          :status="demoStatus"
          checkable
          :default-expanded-keys="['a']"
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
