<script setup lang="ts">
import { ref } from 'vue';
import { ZtCarousel, ZtButton, ZtConfigProvider } from '@ztechjs/zt-ui';
const index = ref(0);
</script>
<template>
  <ZtConfigProvider theme="dark" :border-radius="4"
    ><ZtCarousel v-model="index" :loop="false" :height="180"
      ><div class="slide">第一页：上一张按钮禁用</div>
      <div class="slide">第二页：下一张按钮禁用</div></ZtCarousel
    >
    <div class="actions">
      <ZtButton @click="index = 0">回到第一张</ZtButton
      ><span>当前索引 {{ index }}</span>
    </div></ZtConfigProvider
  >
</template>
<style scoped>
.slide {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 30px;
  box-sizing: border-box;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
</style>
