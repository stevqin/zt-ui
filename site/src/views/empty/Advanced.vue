<script setup lang="ts">
import { ZtEmpty, ZtConfigProvider } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtConfigProvider theme="dark" size="small"
    ><div class="dark">
      <ZtEmpty :image-size="48"
        ><template #image
          ><span class="symbol" aria-hidden="true">⌕</span></template
        ><template #description
          >没有匹配的客户，请尝试其他关键词。</template
        ></ZtEmpty
      >
    </div></ZtConfigProvider
  >
</template>
<style scoped>
.dark {
  background: #1b2433;
}
.symbol {
  font-size: 48px;
  line-height: 48px;
}
</style>
