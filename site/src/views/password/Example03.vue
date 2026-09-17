<script setup lang="ts">
import { ZtPassword } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="password-demo">
    <ZtPassword model-value="secret" status="success" /><ZtPassword
      model-value="secret"
      status="warning"
    /><ZtPassword model-value="secret" status="error" />
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
