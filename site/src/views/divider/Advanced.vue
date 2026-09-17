<script setup lang="ts">
import { ZtDivider, ZtConfigProvider } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtConfigProvider theme="dark"
    ><div class="dark">
      查看<ZtDivider direction="vertical" />编辑<ZtDivider
        direction="vertical"
        dashed
      />下载<ZtDivider>操作区</ZtDivider>
    </div></ZtConfigProvider
  >
</template>
<style scoped>
.dark {
  background: #1b2433;
  color: #eef2ff;
  padding: 20px;
}
</style>
