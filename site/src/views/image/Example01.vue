<script setup lang="ts">
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b8ff9"/><stop offset="1" stop-color="#61d9a6"/></linearGradient></defs><rect width="800" height="500" fill="url(#a)"/><circle cx="630" cy="120" r="62" fill="#fff" opacity=".75"/><path d="M0 410 210 215l150 145 105-105 335 245H0Z" fill="#172554" opacity=".55"/></svg>',
  );
const demoImage2 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800"><defs><linearGradient id="b" y2="1"><stop stop-color="#fb7185"/><stop offset="1" stop-color="#fbbf24"/></linearGradient></defs><rect width="500" height="800" rx="40" fill="url(#b)"/><circle cx="250" cy="270" r="125" fill="#fff" opacity=".8"/><path d="M75 760c20-185 120-280 175-280s155 95 175 280" fill="#7c2d12" opacity=".5"/></svg>',
  );
const demoImage3 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" rx="80" fill="#dbeafe"/><circle cx="150" cy="115" r="58" fill="#3b82f6"/><path d="M45 295c7-87 50-130 105-130s98 43 105 130" fill="#1d4ed8"/></svg>',
  );

import { ZtImage } from '@ztechjs/zt-ui';
const images = [demoImage1, demoImage2, demoImage3];
</script>

<template>
  <div class="image-row">
    <ZtImage
      v-for="fit in ['cover', 'contain', 'fill', 'none', 'scale-down']"
      :key="fit"
      class="demo-image"
      :src="demoImage1"
      :fit="fit as any"
      :preview-src-list="images"
    />
  </div>
</template>

<style scoped>
.image-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.demo-image {
  width: 220px;
  height: 140px;
}
</style>
