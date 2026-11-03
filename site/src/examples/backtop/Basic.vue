<script setup lang="ts">
import { ref } from "vue";
import { ZtBacktop } from "@ztechjs/zt-ui";
const container = ref<HTMLElement>(),
  clicked = ref(0);
</script>
<template>
  <div class="backtop-demo">
    <div ref="container" class="scroll">
      <p v-for="n in 30" :key="n">销售明细 {{ n }} · 华东区域</p>
    </div>
    <ZtBacktop
      :container="() => container"
      position="absolute"
      :visibility-height="100"
      :right="16"
      :bottom="16"
      @click="clicked++"
    />
  </div>
  <p role="status">已返回 {{ clicked }} 次</p>
</template>
<style scoped>
.backtop-demo {
  position: relative;
  isolation: isolate;
}
.scroll {
  height: 240px;
  overflow: auto;
  border: 1px solid var(--zt-border, #8884);
  border-radius: var(--zt-radius);
  overscroll-behavior: contain;
  padding: 12px;
}
</style>
