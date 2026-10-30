<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputOtp } from '@ztechjs/zt-ui';
const value = ref('');
const completed = ref('');
</script>

<template>
  <div class="demo">
    <ZtInputOtp v-model="value" @complete="completed = $event" />
    <p>验证码：{{ value }}；最近完成：{{ completed || '未完成' }}</p>
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
