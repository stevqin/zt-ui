<script setup lang="ts">
import { ref } from "vue";
import { ZtBacktop } from "@ztechjs/zt-ui";
const container = ref<HTMLElement>();
</script>
<template>
  <div class="backtop-demo">
    <div ref="container" class="scroll">
      <p v-for="n in 25" :key="n">门店库存记录 {{ n }}</p>
    </div>
    <ZtBacktop
      :container="() => container"
      position="absolute"
      :visibility-height="80"
      :right="16"
      :bottom="16"
      label="返回门店列表顶部"
    >
      TOP
    </ZtBacktop>
  </div>
</template>

<style scoped>
.backtop-demo {
  position: relative;
  isolation: isolate;
}
.scroll {
  height: 200px;
  overflow: auto;
  border: 1px solid var(--zt-border, #8884);
  border-radius: var(--zt-radius);
  padding: 12px;
  overscroll-behavior: contain;
}
</style>
