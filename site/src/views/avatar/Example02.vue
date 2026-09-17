<script setup lang="ts">
import { ZtAvatar } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="avatar-row">
    <ZtAvatar
      v-for="status in ['primary', 'success', 'warning', 'danger', 'info']"
      :key="status"
      :status="status as any"
      :alt="status"
    /><ZtAvatar src="data:image/png;base64,invalid" alt="失败后备" />
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
