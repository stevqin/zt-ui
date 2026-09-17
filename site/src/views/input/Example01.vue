<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput } from '@ztechjs/zt-ui';
const basic = ref('');
</script>

<template>
  <div class="input-demo">
    <ZtInput v-model="basic" placeholder="请输入内容" /><span>当前值：{{ basic || '暂无' }}</span>
  </div>
</template>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
.input-demo > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
