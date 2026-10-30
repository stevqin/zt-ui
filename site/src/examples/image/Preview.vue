<script setup lang="ts">
import { ZtImage, ZtSpace } from '@ztechjs/zt-ui';
const makeImage = (color: string, title: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${color}"/><text x="320" y="220" text-anchor="middle" fill="white" font-size="40">${title}</text></svg>`,
  );
const images = [
  makeImage('#2563eb', '秋冬系列'),
  makeImage('#059669', '春夏系列'),
  makeImage('#7c3aed', '经典系列'),
];
</script>
<template>
  <ZtSpace wrap>
    <ZtImage
      v-for="(src, index) in images"
      :key="src"
      :src="src"
      :alt="`系列图片 ${index + 1}`"
      show-preview
      :preview-src-list="images"
      :initial-index="index"
      style="width: 150px; height: 100px"
    />
    <ZtImage
      src="data:image/png;base64,broken"
      alt="无法加载的商品图片"
      style="width: 150px; height: 100px"
    >
      <template #error>图片暂不可用</template>
    </ZtImage>
  </ZtSpace>
</template>
