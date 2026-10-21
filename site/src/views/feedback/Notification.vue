<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtNotification } from '@ztechjs/zt-alert';
import type { NoticeId, NoticeStatus } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const statuses: NoticeStatus[] = ['success', 'error', 'warning', 'info'];
const labels = {
  success: '同步成功',
  error: '同步失败',
  warning: '库存提醒',
  info: '系统通知',
};
const ids = new Set<NoticeId>();
const currentId = ref<NoticeId>();
function show(status: NoticeStatus) {
  ids.add(
    ZtNotification[status]({
      title: labels[status],
      content:
        '这是一条带标题的通知。较长的正文会自动换行，图标始终对齐内容左上方。',
    }),
  );
}
function persistent() {
  currentId.value = ZtNotification.open({
    id: 'feedback-stock',
    title: '库存预警',
    content: '请检查低于安全库存的商品。',
    status: 'warning',
    duration: 0,
  });
  ids.add(currentId.value);
}
function update() {
  if (currentId.value === undefined) return;
  ZtNotification.success({
    id: currentId.value,
    title: '处理完成',
    content: '库存补货计划已提交，2 秒后关闭。',
    duration: 2000,
  });
}
onBeforeUnmount(() => ids.forEach((id) => ZtNotification.close(id)));
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton
        v-for="status in statuses"
        :key="status"
        @click="show(status)"
        >{{ labels[status] }}</ZtButton
      >
      <ZtButton @click="persistent">常驻通知</ZtButton>
      <ZtButton :disabled="currentId === undefined" @click="update"
        >更新通知</ZtButton
      >
      <ZtButton
        :disabled="currentId === undefined"
        @click="ZtNotification.close(currentId!)"
        >关闭指定通知</ZtButton
      >
      <ZtButton
        @click="
          ZtNotification.clear();
          currentId = undefined;
        "
        >清空全部通知</ZtButton
      >
    </div>
    <p>
      默认位于右上角，约 5.2
      秒后消失。连续点击可观察侧向弹性滑入与通知堆叠；通知的清空和关闭独立于
      Message。
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: grid;
  gap: 14px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
p {
  margin: 0;
  line-height: 1.7;
}
.result {
  padding: 10px 14px;
  border: 1px solid var(--zt-border, #dce2ed);
  border-radius: 8px;
  overflow-wrap: anywhere;
}
</style>
