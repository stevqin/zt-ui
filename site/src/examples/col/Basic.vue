<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="12">
    <ZtCol :span="6"><div class="cell">span 6</div></ZtCol>
    <ZtCol :span="12" :offset="6"><div class="cell">span 12 · offset 6</div></ZtCol>
  </ZtRow>
</template>
<style scoped>
.cell {
  padding: 16px;
  background: #1677ff20;
  text-align: center;
  border: 1px solid #1677ff30;
}
.tall {
  padding-block: 30px;
}
</style>
