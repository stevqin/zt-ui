<script setup lang="ts">
import { ZtPageHeader, ZtConfigProvider } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>
<template>
  <div class="headers">
    <ZtConfigProvider
      v-for="size in sizes"
      :key="size"
      :size="size"
      theme="dark"
      ><div class="dark">
        <ZtPageHeader :show-back="false"
          ><template #title>{{ size }} 排版</template
          ><template #description>继承主题和字号，可替换所有文本区域。</template
          ><template #extra>2026 年</template></ZtPageHeader
        >
      </div></ZtConfigProvider
    >
  </div>
</template>
<style scoped>
.headers {
  display: grid;
  gap: 12px;
}
.dark {
  background: #1b2433;
  padding: 16px;
  border-radius: 8px;
}
</style>
