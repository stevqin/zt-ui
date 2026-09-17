<script setup lang="ts">
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800"><defs><linearGradient id="b" y2="1"><stop stop-color="#fb7185"/><stop offset="1" stop-color="#fbbf24"/></linearGradient></defs><rect width="500" height="800" rx="40" fill="url(#b)"/><circle cx="250" cy="270" r="125" fill="#fff" opacity=".8"/><path d="M75 760c20-185 120-280 175-280s155 95 175 280" fill="#7c2d12" opacity=".5"/></svg>',
  );

import { ZtAvatar } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtAvatar alt="自定义头像" status="warning">ZT</ZtAvatar
      ><ZtAvatar icon="user" alt="图标头像" /><ZtAvatar
        src="data:image/png;base64,invalid"
        alt="林青"
      /><ZtAvatar :src="demoImage1" fit="contain" :size="80" shape="square" alt="完整图片" />
    </div>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
