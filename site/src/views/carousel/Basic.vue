<script setup lang="ts">
import { ref } from 'vue';
import { ZtCarousel } from '@ztechjs/zt-ui';
const current = ref(0);
const slides = [
  { title: '春季新品', text: '当季产品经营概览', color: '#3a5a88' },
  { title: '销售趋势', text: '每周更新重点经营数据', color: '#426858' },
  { title: '库存健康', text: '提前识别库存结构风险', color: '#725979' },
];
</script>
<template>
  <div>
    <ZtCarousel v-model="current" :height="260" autoplay :interval="4000"
      ><article
        v-for="slide in slides"
        :key="slide.title"
        class="slide"
        :style="{ background: slide.color }"
      >
        <h3>{{ slide.title }}</h3>
        <p>{{ slide.text }}</p>
      </article></ZtCarousel
    >
    <p>当前第 {{ current + 1 }} 张；可左右滑动，或聚焦轮播使用方向键。</p>
  </div>
</template>
<style scoped>
.slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-sizing: border-box;
  padding: 28px;
  text-align: center;
}
.slide h3 {
  font-size: 28px;
  margin: 0 0 8px;
}
</style>
