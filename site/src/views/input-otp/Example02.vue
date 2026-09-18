<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtInputOtpStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtInputOtp } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtInputOtpStatus>('default');
const short = ref('');
</script>

<template>
  <ZtInputOtp
    :status="demoStatus"
    v-model="short"
    :length="4"
    separator="-"
    :separator-after="2"
    aria-label="四位验证码"
  />
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
