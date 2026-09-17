<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="[16, 12]" justify="space-between" align="center"
    ><ZtCol v-for="n in 6" :key="n" :span="8" :xs="12" :md="8"
      ><div class="cell">第 {{ n }} 栏</div></ZtCol
    ></ZtRow
  >
</template>
<style scoped>
.cell {
  padding: 20px 8px;
  text-align: center;
  background: #407de51a;
  border: 1px solid #407de533;
  border-radius: 6px;
}
</style>
