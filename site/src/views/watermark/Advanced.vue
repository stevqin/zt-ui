<script setup lang="ts">
import { ZtWatermark, ZtConfigProvider } from '@ztechjs/zt-ui';
const logo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50"><rect width="120" height="50" rx="8" fill="#5387d4"/><text x="60" y="32" text-anchor="middle" fill="white" font-size="22">ZT UI</text></svg>',
  );
</script>
<template>
  <ZtConfigProvider theme="dark"
    ><ZtWatermark
      :image="logo"
      content="ZT UI"
      :width="100"
      :height="42"
      :opacity="0.3"
      :gap="[40, 60]"
      ><div class="document">
        <h3>图片水印</h3>
        <p>图片加载失败时回退到文字。图片使用内联示例资源，无外部网络请求。</p>
      </div></ZtWatermark
    ></ZtConfigProvider
  >
</template>
<style scoped>
.document {
  background: #1b2433;
  min-height: 240px;
  padding: 24px;
  color: #eef2ff;
}
</style>
