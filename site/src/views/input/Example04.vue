<script setup lang="ts">
import { ZtInput } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="input-demo">
    <ZtInput model-value="状态正确" status="success" /><ZtInput
      model-value="请注意格式"
      status="warning"
    /><ZtInput model-value="校验失败" status="error" aria-label="校验失败" />
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
