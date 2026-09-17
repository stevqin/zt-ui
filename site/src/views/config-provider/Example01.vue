<script setup lang="ts">
import { ZtConfigProvider, ZtButton, ZtInput } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtConfigProvider
    size="large"
    theme="light"
    :border-radius="6"
    style="display: flex; gap: 12px; flex-wrap: wrap"
    ><ZtInput placeholder="继承全局 large" style="width: 220px" /><ZtButton status="primary"
      >保存</ZtButton
    ><ZtButton size="small">单独设置 small</ZtButton></ZtConfigProvider
  >
</template>
