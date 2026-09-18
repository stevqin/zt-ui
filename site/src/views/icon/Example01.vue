<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtIconStatus } from '@ztechjs/zt-ui';
import { ZtIcon, ztIconNames } from '@ztechjs/zt-ui';
import type { ZtIconName } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtIconStatus>('default');
</script>

<template>
  <div class="icon-grid">
    <div v-for="name in ztIconNames" :key="name">
      <ZtIcon
        :status="demoStatus"
        :name="name as ZtIconName"
        :label="name"
      /><span>{{ name }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
}
.icon-grid > div {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  font-size: 12px;
}
.icon-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.icon-row :deep(svg) {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
