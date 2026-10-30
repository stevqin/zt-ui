<script setup lang="ts">
import { ZtRow, ZtCol } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtRow :gutter="[16, 16]">
    <ZtCol
      v-for="title in ['华东区域', '华南区域', '华北区域']"
      :key="title"
      :xs="24"
      :md="12"
      :xl="8"
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
