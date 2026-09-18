<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtDatePickerStatus } from '@ztechjs/zt-ui';
import { reactive, ref } from 'vue';
import {
  ZtDatePickerPanel,
  ZtConfigProvider,
  type ZtComponentSize,
  type ZtDatePickerValue,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtDatePickerStatus>('primary');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
const values = reactive<ZtDatePickerValue[]>([
  '2026-09-17',
  '2026-09-17',
  '2026-09-17',
  '2026-09-17',
  '2026-09-17',
]);
const dark = ref(false);
</script>
<template>
  <div class="picker-demo">
    <label><input v-model="dark" type="checkbox" />深色主题</label
    ><ZtConfigProvider :theme="dark ? 'dark' : 'light'" :border-radius="8"
      ><div class="picker-demo">
        <div v-for="(size, i) in sizes" :key="size">
          <p>{{ size }}</p>
          <ZtDatePickerPanel
            :status="demoStatus"
            v-model="values[i]"
            :size="size"
          />
        </div>
        <ZtDatePickerPanel
          :status="demoStatus"
          :model-value="values[0]"
          disabled
        /><ZtDatePickerPanel
          :status="demoStatus"
          :model-value="values[0]"
          readonly
        /></div
    ></ZtConfigProvider>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
