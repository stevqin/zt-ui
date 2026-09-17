<script setup lang="ts">
import { ZtButton, useZtMessage } from '@ztechjs/zt-ui';
import type { ZtMessageType } from '@ztechjs/zt-ui';
const message = useZtMessage();
const types: ZtMessageType[] = ['success', 'info', 'warning', 'error'];
</script>
<template>
  <div class="demo-row">
    <ZtButton
      v-for="type in types"
      :key="type"
      @click="message({ message: type + ' 操作反馈', type })"
      >{{ type }}</ZtButton
    >
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
