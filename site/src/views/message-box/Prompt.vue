<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  useZtMessageBox,
  ZtMessageBoxDismissed,
} from '@ztechjs/zt-ui';
const box = useZtMessageBox(),
  name = ref('未命名');
async function open() {
  try {
    const result = await box.prompt('请输入至少 3 个字符', {
      title: '修改名称',
      inputValue: name.value,
      inputValidator: (value) =>
        value.trim().length >= 3 || '至少输入 3 个字符',
      beforeConfirm: () =>
        new Promise((resolve) => setTimeout(() => resolve(true), 600)),
    });
    name.value = result.value;
  } catch (e) {
    if (!(e instanceof ZtMessageBoxDismissed)) name.value = '操作失败';
  }
}
</script>
<template>
  <div class="demo-row">
    <ZtButton @click="open">输入名称</ZtButton
    ><span role="status">{{ name }}</span>
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
