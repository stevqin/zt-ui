<script setup lang="ts">
import { ZtTooltip, ZtButton } from '@ztechjs/zt-ui';
import type { ZtPopoverPlacement } from '@ztechjs/zt-ui';
const placements: ZtPopoverPlacement[] = ['top', 'bottom', 'left', 'right'];
</script>
<template>
  <div class="demo-row">
    <ZtTooltip
      v-for="placement in placements"
      :key="placement"
      :placement="placement"
      :content="placement + ' 方位说明'"
      ><ZtButton>{{ placement }}</ZtButton></ZtTooltip
    >
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
