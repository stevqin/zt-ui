<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { reactive, ref } from 'vue';
import {
  ZtColorPicker,
  ZtConfigProvider,
  type ZtComponentSize,
} from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
const values = reactive<string[]>([
  '#245edb',
  '#245edb',
  '#245edb',
  '#245edb',
  '#245edb',
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
          <ZtColorPicker
            :status="demoStatus"
            v-model="values[i]"
            :size="size"
            clearable
          />
        </div>
        <ZtColorPicker
          :status="demoStatus"
          :model-value="values[0]"
          disabled
        /><ZtColorPicker
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
