<script setup lang="ts">
import { ZtTag } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtTag size="mini" status="primary">Mini</ZtTag
    ><ZtTag size="small" status="primary">Small</ZtTag><ZtTag status="primary">Default</ZtTag
    ><ZtTag size="medium" status="primary">Medium</ZtTag
    ><ZtTag size="large" status="primary">Large</ZtTag>
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
