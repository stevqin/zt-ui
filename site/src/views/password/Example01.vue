<script setup lang="ts">
import { ref } from 'vue';
import { ZtPassword } from '@ztechjs/zt-ui';
const password = ref('');
</script>

<template>
  <div class="password-demo">
    <ZtPassword v-model="password" placeholder="请输入密码" autocomplete="current-password" />
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
