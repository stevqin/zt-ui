<script setup lang="ts">
import { ZtInputOtp } from '@ztechjs/zt-ui';
import type { ZtInputOtpStatus } from '@ztechjs/zt-ui';
const statuses: ZtInputOtpStatus[] = ['default', 'primary', 'success', 'warning', 'danger', 'info'];
</script>

<template>
  <div class="otp-examples">
    <div v-for="status in statuses" :key="status">
      <span>{{ status }}</span
      ><ZtInputOtp model-value="012" :status="status" :aria-label="status + '验证码'" />
    </div>
  </div>
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
