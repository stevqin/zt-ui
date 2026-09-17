<script setup lang="ts">
import { ZtLayout, ZtAside, ZtMain, ZtConfigProvider } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtConfigProvider theme="dark"
    ><ZtLayout direction="horizontal" class="dark-shell"
      ><ZtAside width="30%">侧栏宽度 30%</ZtAside
      ><ZtMain>显式指定横向布局，宽度可使用百分比。</ZtMain></ZtLayout
    ></ZtConfigProvider
  >
</template>
<style scoped>
.dark-shell {
  min-height: 130px;
  padding: 16px;
  gap: 16px;
  background: #1b2433;
}
</style>
