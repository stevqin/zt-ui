<script setup lang="ts">
import { ZtSpace, ZtButton } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace direction="vertical" align="stretch" :gap="16" style="max-width: 400px">
    <ZtSpace justify="space-between">
      <span>邮件通知</span>
      <ZtButton text>修改</ZtButton>
    </ZtSpace>
    <ZtSpace justify="space-between">
      <span>数据更新时间</span>
      <span>每日 08:00</span>
    </ZtSpace>
  </ZtSpace>
</template>
