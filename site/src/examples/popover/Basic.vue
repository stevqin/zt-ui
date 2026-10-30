<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopover, ZtButton, ZtCheckbox } from '@ztechjs/zt-ui';
const subscribed = ref(false);
</script>

<template>
  <div class="demo">
    <ZtPopover placement="bottom-start" :width="260">
      <ZtButton>通知偏好</ZtButton>
      <template #content>
        <p>订阅库存提醒</p>
        <ZtCheckbox v-model="subscribed">库存低于安全线时通知</ZtCheckbox>
      </template>
    </ZtPopover>
    <p>{{ subscribed ? '已订阅' : '未订阅' }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
