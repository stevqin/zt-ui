<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtAvatarStatus } from '@ztechjs/zt-ui';
import { ZtAvatar } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtAvatarStatus>('default');
</script>

<template>
  <div class="avatar-row">
    <ZtAvatar :status="demoStatus" :alt="demoStatus" /><ZtAvatar
      :status="demoStatus"
      src="data:image/png;base64,invalid"
      alt="失败后备"
    />
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
