<script setup lang="ts">
import { ZtPassword } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="password-demo">
    <ZtPassword model-value="secret" disabled /><ZtPassword model-value="secret" readonly />
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
