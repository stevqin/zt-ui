<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="12"
    ><ZtCol
      :span="12"
      :offset="6"
      :xs="{ span: 24, offset: 0 }"
      :md="{ span: 12, offset: 6 }"
      ><div class="cell">
        居中的嵌套区域<ZtRow :gutter="8"
          ><ZtCol :span="12"><div class="inner">12</div></ZtCol
          ><ZtCol :span="12"><div class="inner">12</div></ZtCol></ZtRow
        >
      </div></ZtCol
    ></ZtRow
  >
</template>
<style scoped>
.cell {
  background: #407de51a;
  padding: 20px;
  border-radius: 6px;
}
.inner {
  margin-top: 12px;
  padding: 10px;
  background: #407de522;
  text-align: center;
}
</style>
