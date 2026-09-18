<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtColorPickerPanel } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref('invalid');
</script>
<template>
  <div class="picker-demo">
    <ZtColorPickerPanel
      :status="demoStatus"
      v-model="value"
      :presets="['#f80', 'rgb(0,128,255)', 'hsl(280,60%,50%)']"
    />
    <p>初始非法值会明确报错。选择预设或输入有效颜色可修复，点击确定提交。</p>
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
