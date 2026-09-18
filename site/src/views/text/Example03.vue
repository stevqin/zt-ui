<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
import { ZtText } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTextStatus>('default');
</script>

<template>
  <div class="text-limit">
    <ZtText :status="demoStatus" truncated
      >单行内容过长时使用省略号，并保留完整 title。</ZtText
    ><ZtText :status="demoStatus" :line-clamp="2" tag="p"
      >多行内容超过指定行数后截断。适合卡片摘要、备注和列表说明。这里增加更多内容来展示两行后的省略效果。</ZtText
    >
  </div>
</template>

<style scoped>
.text-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.text-limit {
  display: grid;
  gap: 18px;
  width: min(360px, 100%);
}
</style>
