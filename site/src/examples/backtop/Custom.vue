<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtBacktop } from '@ztechjs/zt-ui';
const container = ref<HTMLElement>();
</script>
<template>
  <div
    ref="container"
    style="height: 200px; overflow: auto; border: 1px solid #8884; padding: 12px"
  >
    <p v-for="n in 25" :key="n">门店库存记录 {{ n }}</p>
  </div>
  <ZtBacktop
    :container="() => container"
    :visibility-height="80"
    :right="88"
    :bottom="28"
    label="返回门店列表顶部"
  >
    TOP
  </ZtBacktop>
</template>
