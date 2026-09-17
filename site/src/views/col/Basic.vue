<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="[16, 16]"
    ><ZtCol :xs="24" :sm="12" :lg="8"><div class="cell">销售</div></ZtCol
    ><ZtCol :xs="24" :sm="12" :lg="8"><div class="cell">库存</div></ZtCol
    ><ZtCol :xs="24" :sm="24" :lg="8"
      ><div class="cell">利润</div></ZtCol
    ></ZtRow
  >
</template>
<style scoped>
.cell {
  background: #407de51a;
  padding: 24px;
  border-radius: 6px;
}
</style>
