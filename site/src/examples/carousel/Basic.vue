<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCarousel } from '@ztechjs/zt-ui';
const index = ref(0),
  titles = ['秋冬新品上市', '会员积分活动', '周末门店特惠'];
</script>
<template>
  <ZtCarousel v-model="index" :height="200" label="门店活动轮播">
    <div v-for="title in titles" :key="title" class="slide">{{ title }}</div>
  </ZtCarousel>
  <p>当前活动：{{ titles[index] }}</p>
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
