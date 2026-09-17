<script setup lang="ts">
import { ZtTypography, ZtConfigProvider } from '@ztechjs/zt-ui';
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>
<template>
  <ZtConfigProvider theme="dark"
    ><div class="dark">
      <ZtTypography
        v-for="size in sizes"
        :key="size"
        variant="paragraph"
        :size="size"
        :text="size + ' 继承文本尺寸'"
      /><ZtTypography italic underline text="斜体下划线" /><ZtTypography
        deleted
        text="已废弃数据"
      /><ZtTypography
        variant="paragraph"
        :line-clamp="2"
        text="这是一段较长的说明文本，用于演示多行截断。它会在指定的行数之后自动显示省略号。组件保留完整的文本内容并提供原生提示。"
      /></div
  ></ZtConfigProvider>
</template>
<style scoped>
.dark {
  background: #1b2433;
  padding: 20px;
  max-width: 360px;
}
</style>
