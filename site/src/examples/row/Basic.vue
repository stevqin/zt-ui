<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="[16, 12]">
    <ZtCol
      v-for="title in ['销售额', '订单数', '客单价', '毛利率']"
      :key="title"
      :span="8"
    >
      <div class="cell">{{ title }}</div>
    </ZtCol>
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
