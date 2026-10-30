<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow justify="space-between" align="middle">
    <ZtCol :span="7"><div class="cell tall">左侧筛选区</div></ZtCol>
    <ZtCol :span="7"><div class="cell">右侧操作区</div></ZtCol>
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
