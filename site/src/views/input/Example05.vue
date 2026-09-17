<script setup lang="ts">
import { ZtInput } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="input-demo">
    <ZtInput model-value="Mini" size="mini" /><ZtInput model-value="Small" size="small" /><ZtInput
      model-value="Default"
      size="default"
    /><ZtInput model-value="Medium" size="medium" /><ZtInput model-value="Large" size="large" />
  </div>
</template>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
.input-demo > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
