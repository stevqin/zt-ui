<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtQRCode, ZtSegmented, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
import type { ZtQRCodeInstance } from '@ztechjs/zt-ui';
const qr = ref<ZtQRCodeInstance>(),
  mode = ref('svg'),
  message = ref('SVG 下载为矢量图；Canvas 下载为 PNG');
</script>
<template>
  <ZtSpace direction="vertical" align="start">
    <ZtSegmented
      v-model="mode"
      :options="['svg', 'canvas']"
      aria-label="二维码渲染模式"
    />
    <ZtQRCode
      ref="qr"
      value="DEMO202610001"
      :render-as="mode === 'canvas' ? 'canvas' : 'svg'"
      level="H"
      label="订单编号二维码"
      @download="message = `已下载 ${$event}`"
      @error="message = '编码或下载失败'"
    />
    <ZtButton @click="qr?.download('order-code')">下载二维码</ZtButton>
    <span role="status">{{ message }}</span>
  </ZtSpace>
</template>
