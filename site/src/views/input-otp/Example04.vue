<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputOtp } from '@ztechjs/zt-ui';
const masked = ref('');
</script>

<template>
  <ZtInputOtp v-model="masked" mask aria-label="私密验证码" />
</template>

<style scoped>
.otp-feedback {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  color: var(--zt-text-muted);
  font-size: 13px;
}
.otp-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.otp-examples > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.otp-examples > div > span {
  color: var(--zt-text-muted);
  font-size: 12px;
}
</style>
