<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtIconStatus } from '@ztechjs/zt-ui';
import { ZtIcon } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtIconStatus>('default');
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtIcon :size="36" :status="demoStatus" label="自定义太阳"
        ><svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v3m0 16v3M1 12h3m16 0h3" /></svg></ZtIcon
      ><ZtIcon
        :status="demoStatus"
        name="check"
        :stroke-width="3"
        :size="32"
        label="粗描边确认"
      />
    </div>
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
