<script setup lang="ts">
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtBadge :value="0" show-zero><ZtButton>显示零值</ZtButton></ZtBadge
      ><ZtBadge :value="0" :show-zero="false"><ZtButton>隐藏零值</ZtButton></ZtBadge
      ><ZtBadge :value="120" :max="99"><ZtButton>最多 99+</ZtButton></ZtBadge>
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
