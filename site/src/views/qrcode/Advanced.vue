<script setup lang="ts">
import { ref } from 'vue';
import { ZtQRCode, ZtButton } from '@ztechjs/zt-ui';
import type { ZtQRCodeInstance } from '@ztechjs/zt-ui';
const canvas = ref<ZtQRCodeInstance>();
</script>
<template>
  <div class="examples">
    <div>
      <ZtQRCode
        ref="canvas"
        value="ZT UI Canvas"
        render-as="canvas"
        color="#183665"
        background="#eff5ff"
        :size="168"
        :margin="4"
      />
      <p>
        <ZtButton @click="canvas?.download('canvas-code')">下载 PNG</ZtButton>
      </p>
    </div>
    <div>
      <p>空值</p>
      <ZtQRCode value="" />
    </div>
    <div>
      <p>超出容量</p>
      <ZtQRCode :value="'内容'.repeat(5000)" />
    </div>
  </div>
</template>
<style scoped>
.examples {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}
</style>
