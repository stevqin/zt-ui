<script setup lang="ts">
import { h, ref } from 'vue';
import { ZtButton, useZtNotification } from '@ztechjs/zt-ui';
const notify = useZtNotification(),
  state = ref('等待操作');
function open() {
  const instance = notify({
    title: '审核任务',
    duration: 0,
    message: h(
      ZtButton,
      {
        onClick: () => {
          state.value = '已查看审核任务';
          instance.close();
        },
      },
      () => '查看任务',
    ),
  });
}
</script>
<template>
  <div class="demo-stack">
    <ZtButton @click="open">显示操作通知</ZtButton>
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
