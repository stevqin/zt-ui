<script setup lang="ts">
import { ZtButton, useZtMessage } from '@ztechjs/zt-ui';
import type { ZtMessageHandle } from '@ztechjs/zt-ui';
const message = useZtMessage();
let handle: ZtMessageHandle | undefined;
function open() {
  handle = message({
    message: '等待后台处理结果',
    duration: 0,
    grouping: true,
  });
}
</script>
<template>
  <div class="demo-row">
    <ZtButton @click="open">合并相同提示</ZtButton
    ><ZtButton @click="handle?.close()">关闭该提示</ZtButton>
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
