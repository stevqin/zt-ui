<script setup lang="ts">
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b8ff9"/><stop offset="1" stop-color="#61d9a6"/></linearGradient></defs><rect width="800" height="500" fill="url(#a)"/><circle cx="630" cy="120" r="62" fill="#fff" opacity=".75"/><path d="M0 410 210 215l150 145 105-105 335 245H0Z" fill="#172554" opacity=".55"/></svg>',
  );

import { ref } from 'vue';
import { ZtImage, ZtScrollbar } from '@ztechjs/zt-ui';
const loaded = ref(false);
</script>

<template>
  <div class="example-stack">
    <ZtScrollbar :height="240" aria-label="懒加载图片演示"
      ><p style="height: 500px">向下滚动查看图片。浏览器会根据距离决定预加载时机。</p>
      <ZtImage
        :src="demoImage1"
        lazy
        alt="山川"
        position="left top"
        fit="cover"
        style="width: 240px; height: 160px"
        @load="loaded = true"
        ><template #placeholder>正在加载图片…</template
        ><template #error>暂时无法加载图片</template></ZtImage
      ></ZtScrollbar
    >
    <p role="status">{{ loaded ? '图片已加载' : '等待图片加载' }}</p>
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
