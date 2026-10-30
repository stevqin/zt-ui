<script setup lang="ts">
import { ZtLink, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace wrap>
    <ZtLink
      href="https://vuejs.org"
      target="_blank"
      status="primary"
      suffix-icon="external-link"
    >
      Vue 官方文档
    </ZtLink>
    <ZtLink href="https://vuejs.org" disabled>暂不可用</ZtLink>
  </ZtSpace>
</template>
