<script setup lang="ts">
import { ZtBlockquote, ZtLink } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtBlockquote size="large">
    <template #title>交付要求 <small>第 2 版</small></template>
    <p>每次交付应附带清晰的变更说明，并对重要的约束作出解释。</p>
    <ZtBlockquote title="附注" status="info" size="small">只记录与本次交付有关的修改，避免混入尚未完成的事项。</ZtBlockquote>
    <template #footer><ZtLink href="https://www.w3.org/TR/" target="_blank" rel="noopener noreferrer">查看公开规范目录</ZtLink></template>
  </ZtBlockquote>
</template>
