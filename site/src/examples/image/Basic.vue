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
      :src="images[0]!"
      alt="秋冬系列 cover 裁切"
      fit="cover"
      style="width: 180px; height: 150px"
    />
    <ZtImage
      :src="images[0]!"
      alt="秋冬系列 contain 完整显示"
      fit="contain"
      style="width: 180px; height: 150px"
    />
  </ZtSpace>
</template>
