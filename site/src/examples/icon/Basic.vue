<script setup lang="ts">
import { ZtIcon, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace wrap>
    <ZtIcon name="search" label="搜索" />
    <ZtIcon name="check" status="success" label="通过" />
    <ZtIcon name="refresh" spin label="正在同步" />
    <ZtIcon name="arrow-up" :rotate="45" label="向右上" />
    <ZtIcon color="#7c3aed" label="自定义星标">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" />
      </svg>
    </ZtIcon>
  </ZtSpace>
</template>
