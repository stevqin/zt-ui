<script setup lang="ts">
import { ref } from 'vue';
import { ZtQRCode, ZtButton } from '@ztechjs/zt-ui';
import type { ZtQRCodeInstance } from '@ztechjs/zt-ui';
const code = ref<ZtQRCodeInstance>(),
  value = ref('https://example.com/订单?id=42'),
  message = ref('');
</script>
<template>
  <div class="demo">
    <label
      >编码内容<input v-model="value" placeholder="输入纯文本或链接" /></label
    ><ZtQRCode
      ref="code"
      :value="value"
      level="H"
      :size="180"
      @error="message = '内容过长或无法编码'"
      @download="message = '已下载 ' + $event"
    /><ZtButton @click="code?.download('order-link')">下载 SVG</ZtButton>
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.demo label {
  display: grid;
  gap: 8px;
  width: 100%;
}
.demo input {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #8a9ab066;
  border-radius: 6px;
  font: inherit;
  color: inherit;
  background: transparent;
}
.demo p {
  margin: 0;
}
</style>
