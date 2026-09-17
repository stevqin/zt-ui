<script setup lang="ts">
import { ZtInput } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="input-demo">
    <ZtInput model-value="禁用内容" disabled /><ZtInput model-value="只读内容" readonly />
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
