<script setup lang="ts">
import { ZtPassword } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="password-demo">
    <ZtPassword model-value="secret" size="mini" /><ZtPassword
      model-value="secret"
      size="small"
    /><ZtPassword model-value="secret" size="default" /><ZtPassword
      model-value="secret"
      size="medium"
    /><ZtPassword model-value="secret" size="large" />
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
