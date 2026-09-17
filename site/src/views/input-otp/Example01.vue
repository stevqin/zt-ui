<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputOtp, ZtButton } from '@ztechjs/zt-ui';
const code = ref('');
const completed = ref(false);
</script>

<template>
  <ZtInputOtp
    v-model="code"
    aria-label="短信验证码"
    @input="completed = false"
    @complete="completed = true"
  />
  <div class="otp-feedback">
    <span aria-live="polite">{{ completed ? '输入完成' : '请输入 6 位验证码' }}</span
    ><ZtButton
      size="small"
      @click="
        code = '';
        completed = false;
      "
      >清空</ZtButton
    >
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
