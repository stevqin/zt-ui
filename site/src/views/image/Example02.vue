<script setup lang="ts">
import { ZtImage } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtImage class="demo-image" src="data:image/png;base64,invalid"
    ><template #error>图片加载失败</template></ZtImage
  >
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
