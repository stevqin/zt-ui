<script setup lang="ts">
import { ZtTag } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtTag effect="light" status="primary">Light</ZtTag
    ><ZtTag effect="dark" status="primary">Dark</ZtTag
    ><ZtTag effect="plain" status="primary">Plain</ZtTag>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
