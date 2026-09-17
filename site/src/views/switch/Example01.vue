<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const basic = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch v-model="basic" /><span>状态：{{ basic ? '开启' : '关闭' }}</span>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
