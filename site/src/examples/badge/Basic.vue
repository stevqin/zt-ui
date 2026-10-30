<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtBadge, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const count = ref(96);
</script>
<template>
  <ZtSpace :gap="24" wrap>
    <ZtBadge :value="count" :max="99">
      <ZtButton @click="count = 0">消息中心</ZtButton>
    </ZtBadge>
    <ZtButton @click="count += 10">新增 10 条</ZtButton>
    <span>未读 {{ count }} 条</span>
  </ZtSpace>
</template>
