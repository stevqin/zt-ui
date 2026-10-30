<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtBacktop } from '@ztechjs/zt-ui';
const container = ref<HTMLElement>(),
  clicked = ref(0);
</script>
<template>
  <div ref="container" class="scroll">
    <p v-for="n in 30" :key="n">销售明细 {{ n }} · 华东区域</p>
  </div>
  <ZtBacktop
    :container="() => container"
    :visibility-height="100"
    :right="28"
    :bottom="28"
    @click="clicked++"
  />
  <p>已返回 {{ clicked }} 次</p>
</template>
<style scoped>
.scroll {
  height: 240px;
  overflow: auto;
  border: 1px solid #8884;
  padding: 12px;
}
</style>
