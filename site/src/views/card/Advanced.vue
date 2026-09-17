<script setup lang="ts">
import { ZtCard, ZtConfigProvider } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>
<template>
  <div class="cards">
    <ZtConfigProvider
      v-for="size in sizes"
      :key="size"
      :size="size"
      theme="dark"
      :border-radius="4"
      ><ZtCard :title="size" shadow="always" :bordered="false"
        >内边距继承配置尺寸。</ZtCard
      ></ZtConfigProvider
    ><ZtCard padding="24px 12px"
      ><template #header>自定义标题</template>自定义内边距</ZtCard
    >
  </div>
</template>
<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
</style>
