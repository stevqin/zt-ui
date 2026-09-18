<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtAvatarStatus } from '@ztechjs/zt-ui';
// 内联示意图让示例无需下载静态资源，可替换为业务图片地址。
const demoImage1 =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" rx="80" fill="#dbeafe"/><circle cx="150" cy="115" r="58" fill="#3b82f6"/><path d="M45 295c7-87 50-130 105-130s98 43 105 130" fill="#1d4ed8"/></svg>',
  );

import { ZtAvatar } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtAvatarStatus>('default');
</script>

<template>
  <div class="avatar-row">
    <ZtAvatar
      :status="demoStatus"
      v-for="size in ['mini', 'small', 'default', 'medium', 'large']"
      :key="size"
      :src="demoImage1"
      alt="头像"
      :size="size as any"
    /><ZtAvatar :status="demoStatus" :size="60" shape="square" alt="林青" />
  </div>
</template>

<style scoped>
.avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
