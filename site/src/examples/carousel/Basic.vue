<script setup lang="ts">
import { ref } from 'vue';
import { ZtCarousel } from '@ztechjs/zt-ui';
const index = ref(0);
const activities = [
  { title: '秋冬新品上市', detail: '轻盈层次，开启新一季的日常灵感', category: 'NEW COLLECTION', color: '#e5edf9', ink: '#224b80', number: '01' },
  { title: '会员积分活动', detail: '让每一次相遇，都成为值得珍藏的礼遇', category: 'MEMBER EXCLUSIVE', color: '#e1eee8', ink: '#275a46', number: '02' },
  { title: '周末门店特惠', detail: '走进门店，发现属于你的周末穿搭', category: 'WEEKEND EDIT', color: '#eee7f4', ink: '#60467c', number: '03' },
];
</script>
<template>
  <ZtCarousel v-model="index" :height="240" label="门店活动轮播">
    <div v-for="activity in activities" :key="activity.title" class="slide" :style="{ background: activity.color, color: activity.ink }">
      <span class="slide__number" aria-hidden="true">{{ activity.number }}</span>
      <div class="slide__copy">
        <span class="slide__category">{{ activity.category }}</span>
        <strong>{{ activity.title }}</strong>
        <p>{{ activity.detail }}</p>
      </div>
    </div>
  </ZtCarousel>
  <p class="caption">{{ String(index + 1).padStart(2, '0') }} / 03 · {{ activities[index]!.title }}<span>方向键切换 · 首尾循环</span></p>
</template>
<style scoped>
.slide { position: relative; height: 100%; display: flex; align-items: center; overflow: hidden; }
.slide__copy { position: relative; padding: 28px 64px; }
.slide__category { display: block; font-size: 10px; font-weight: 600; letter-spacing: .16em; margin-bottom: 12px; }
.slide strong { font-size: clamp(22px, 3vw, 30px); font-weight: 600; }
.slide p { font-size: 13px; margin: 10px 0 0; opacity: .8; }
.slide__number { position: absolute; right: 56px; bottom: -35px; font-size: 210px; line-height: 1; font-weight: 700; opacity: .075; letter-spacing: -.08em; }
.caption { display: flex; gap: 12px; justify-content: space-between; flex-wrap: wrap; font-size: 12px; opacity: .75; margin: 12px 0 0; }
.caption span { opacity: .7; }
@media (max-width: 600px) { .slide__copy { padding-inline: 54px; } .slide p { max-width: 19em; line-height: 1.6; } .slide__number { right: 24px; } }
</style>
