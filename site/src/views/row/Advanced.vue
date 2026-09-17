<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="24" :wrap="false" justify="center" align="middle"
    ><ZtCol :span="8"><div class="cell">固定一行</div></ZtCol
    ><ZtCol :span="12"
      ><ZtRow :gutter="8"
        ><ZtCol :span="12"><div class="cell">嵌套 A</div></ZtCol
        ><ZtCol :span="12"><div class="cell">嵌套 B</div></ZtCol></ZtRow
      ></ZtCol
    ></ZtRow
  >
</template>
<style scoped>
.cell {
  padding: 24px 8px;
  background: #407de51a;
  border-radius: 6px;
  text-align: center;
}
</style>
