<script setup lang="ts">
import { ZtStatistic, ZtConfigProvider } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
const format = (value: number) => (value / 10000).toFixed(1) + ' 万';
</script>
<template>
  <div class="stats">
    <ZtStatistic
      title="无效数据"
      :value="NaN"
      fallback="数据不可用"
    /><ZtStatistic
      title="自定义格式"
      :value="87650"
      :formatter="format"
    /><ZtConfigProvider
      v-for="size in sizes"
      :key="size"
      :size="size"
      theme="dark"
      ><div class="dark">
        <ZtStatistic :title="size" :value="2026"
          ><template #suffix> 年</template></ZtStatistic
        >
      </div></ZtConfigProvider
    >
  </div>
</template>
<style scoped>
.stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.dark {
  padding: 16px;
  background: #1b2433;
  border-radius: 8px;
}
</style>
