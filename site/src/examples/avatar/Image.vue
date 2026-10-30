<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtAvatar, ZtSpace } from '@ztechjs/zt-ui';
const failed = ref(false);
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#dbeafe"/><circle cx="50" cy="36" r="18" fill="#2563eb"/><path d="M15 100Q15 58 50 58T85 100" fill="#2563eb"/></svg>',
  );
</script>
<template>
  <ZtSpace>
    <ZtAvatar :src="portrait" alt="产品设计师" />
    <ZtAvatar src="data:image/png;base64,broken" alt="陈悦" @error="failed = true" />
  </ZtSpace>
  <p role="status">{{ failed ? '图片失败，已显示后备姓名' : '等待图片加载' }}</p>
</template>
