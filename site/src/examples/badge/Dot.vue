<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtBadge, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const read = ref(false);
</script>
<template>
  <ZtSpace :gap="24" wrap>
    <ZtBadge is-dot :hidden="read">
      <ZtButton @click="read = !read">{{ read ? '标记未读' : '查看更新' }}</ZtButton>
    </ZtBadge>
    <ZtBadge :value="0" show-zero :circle="false"><span>待审核</span></ZtBadge>
  </ZtSpace>
</template>
