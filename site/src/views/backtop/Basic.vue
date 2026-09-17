<script setup lang="ts">
import { ref } from 'vue';
import { ZtBacktop } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  clicks = ref(0);
</script>
<template>
  <div>
    <p>滚动超过 120px 后右下角出现按钮，已返回 {{ clicks }} 次。</p>
    <div ref="panel" class="panel">
      <div v-for="n in 30" :key="n" class="row">第 {{ n }} 条记录</div>
    </div>
    <ZtBacktop
      :container="() => panel"
      :visibility-height="120"
      :bottom="90"
      @click="clicks++"
    />
  </div>
</template>
<style scoped>
.panel {
  height: 240px;
  overflow: auto;
  border: 1px solid #8a9ab044;
  border-radius: 8px;
}
.row {
  padding: 14px;
  border-bottom: 1px solid #8a9ab022;
}
</style>
