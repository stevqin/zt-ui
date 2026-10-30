<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCarousel, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
import type { ZtCarouselInstance } from '@ztechjs/zt-ui';
const carousel = ref<ZtCarouselInstance>(),
  autoplay = ref(false);
</script>
<template>
  <label>
    <input v-model="autoplay" type="checkbox" />
    自动播放（2 秒）
  </label>
  <ZtCarousel
    ref="carousel"
    :autoplay="autoplay"
    :interval="2000"
    :loop="false"
    :height="180"
    label="商品系列"
  >
    <div v-for="title in ['通勤系列', '户外系列', '经典系列']" :key="title" class="slide">
      {{ title }}
    </div>
  </ZtCarousel>
  <ZtSpace wrap>
    <ZtButton @click="carousel?.prev()">上一张</ZtButton>
    <ZtButton @click="carousel?.next()">下一张</ZtButton>
    <ZtButton @click="carousel?.goTo(0)">回到第一张</ZtButton>
  </ZtSpace>
</template>
<style scoped>
.slide {
  height: 100%;
  display: grid;
  place-items: center;
  background: #1677ff18;
  font-size: 24px;
}
.slide:nth-child(2) {
  background: #05966918;
}
.slide:nth-child(3) {
  background: #7c3aed18;
}
</style>
