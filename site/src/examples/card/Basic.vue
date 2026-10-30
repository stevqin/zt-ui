<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCard, ZtButton } from '@ztechjs/zt-ui';
const refreshes = ref(0);
</script>
<template>
  <ZtCard title="门店销售概览">
    <template #extra><ZtButton text @click="refreshes++">刷新</ZtButton></template>
    <p>今日销售额 ¥28,600</p>
    <template #footer>已刷新 {{ refreshes }} 次 · 数据每小时更新</template>
  </ZtCard>
</template>
