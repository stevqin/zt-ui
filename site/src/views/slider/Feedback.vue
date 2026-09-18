<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSliderStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSlider } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSliderStatus>('primary');
const value = ref(30),
  draft = ref(30),
  committed = ref(30);
</script>

<template>
  <div class="example-stack">
    <ZtSlider
      :status="demoStatus"
      v-model="value"
      :format-tooltip="(value) => `${value}%`"
      aria-label="折扣比例"
      @input="draft = $event as number"
      @change="committed = $event as number"
    />
    <p>拖动中：{{ draft }}%，提交值：{{ committed }}%</p>
    <ZtSlider
      :status="demoStatus"
      :model-value="60"
      :show-tooltip="false"
      aria-label="无提示滑块"
    />
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
