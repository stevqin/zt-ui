<script setup lang="ts">
import { ref } from 'vue';
import { ZtCarousel, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
import type { ZtCarouselInstance } from '@ztechjs/zt-ui';
const carousel = ref<ZtCarouselInstance>();
const autoplay = ref(false);
const index = ref(0);
const collections = [
  { title: '通勤系列', detail: '从容应对每一天', color: '#e5edf9', ink: '#224b80' },
  { title: '户外系列', detail: '把自然穿进生活', color: '#e1eee8', ink: '#275a46' },
  { title: '经典系列', detail: '经得起时间的选择', color: '#eee7f4', ink: '#60467c' },
];
</script>
<template>
  <div class="controls">
    <label><input v-model="autoplay" type="checkbox" /> 自动播放（2 秒）</label>
    <span>{{ index + 1 }} / {{ collections.length }} · 到末张停止</span>
  </div>
  <ZtCarousel ref="carousel" v-model="index" :autoplay="autoplay" :interval="2000" :loop="false" :height="200" label="商品系列">
    <div v-for="collection in collections" :key="collection.title" class="slide" :style="{ background: collection.color, color: collection.ink }">
      <strong>{{ collection.title }}</strong><span>{{ collection.detail }}</span>
    </div>
  </ZtCarousel>
  <p class="hint">悬停、焦点进入或切换到其他页面时暂停；开启“减少动态效果”时不自动播放。</p>
  <ZtSpace wrap>
    <ZtButton :disabled="index === 0" @click="carousel?.prev()">上一张</ZtButton>
    <ZtButton :disabled="index === collections.length - 1" @click="carousel?.next()">下一张</ZtButton>
    <ZtButton @click="carousel?.goTo(0)">回到第一张</ZtButton>
  </ZtSpace>
</template>
<style scoped>
.controls { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 14px; font-size: 13px; }
.controls label { display: flex; gap: 6px; align-items: center; cursor: pointer; }
.controls > span, .hint { font-size: 12px; opacity: .65; }
.slide { height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; }
.slide strong { font-size: 28px; font-weight: 600; }
.slide span { font-size: 13px; opacity: .8; }
.hint { line-height: 1.7; margin: 12px 0; }
</style>
