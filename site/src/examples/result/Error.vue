<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtResult, ZtButton } from '@ztechjs/zt-ui';
const ok = ref(false);
</script>
<template>
  <ZtResult
    :status="ok ? 'success' : '500'"
    :title="ok ? '连接已恢复' : '报表服务暂时不可用'"
    :sub-title="ok ? '可以继续查询数据。' : '请稍后重试，已填写的筛选条件会保留。'"
  >
    <template #extra>
      <ZtButton v-if="!ok" @click="ok = true">重新连接</ZtButton>
    </template>
  </ZtResult>
</template>
