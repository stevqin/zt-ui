<script setup lang="ts">
import { ref } from 'vue';
import { ZtPassword } from '@ztechjs/zt-ui';
const clearable = ref('Zt-ui@2026');
</script>

<template>
  <div class="password-demo">
    <ZtPassword v-model="clearable" clearable /><ZtPassword
      v-model="clearable"
      :show-toggle="false"
    />
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
