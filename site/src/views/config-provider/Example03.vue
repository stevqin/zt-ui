<script setup lang="ts">
import { ZtConfigProvider, ZtButton, ZtInput } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtConfigProvider size="large" theme="dark" :border-radius="12" style="padding: 20px"
    ><ZtButton>继承 dark / large</ZtButton
    ><ZtConfigProvider
      size="mini"
      theme="light"
      :border-radius="0"
      style="padding: 20px; margin-top: 16px"
      ><ZtInput placeholder="局部 light / mini / 直角" /><ZtButton style="margin-top: 12px"
        >局部覆盖</ZtButton
      ></ZtConfigProvider
    ></ZtConfigProvider
  >
</template>
