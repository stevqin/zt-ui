<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtInputOtpStatus } from '@ztechjs/zt-ui';
import { ZtInputOtp } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtInputOtpStatus>('default');
</script>

<template>
  <div class="otp-examples">
    <ZtInputOtp
      :status="demoStatus"
      model-value="012345"
      disabled
      aria-label="禁用验证码"
    /><ZtInputOtp
      :status="demoStatus"
      model-value="012345"
      readonly
      aria-label="只读验证码"
    />
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
