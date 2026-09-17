<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  useZtMessageBox,
  ZtMessageBoxDismissed,
} from '@ztechjs/zt-ui';
const box = useZtMessageBox(),
  state = ref('等待操作');
async function open(kind: 'alert' | 'confirm') {
  try {
    await box[kind]('此示例只改变本地状态，不删除实际数据。');
    state.value = '已确认';
  } catch (e) {
    state.value = e instanceof ZtMessageBoxDismissed ? e.action : '操作失败';
  }
}
</script>
<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton @click="open('alert')">提示</ZtButton
      ><ZtButton @click="open('confirm')">确认</ZtButton>
    </div>
    <p role="status">{{ state }}</p>
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
