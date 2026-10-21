<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtMessage } from '@ztechjs/zt-alert';
import type { NoticeId, NoticeStatus } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const statuses: NoticeStatus[] = ['success', 'error', 'warning', 'info'];
const labels = {
  success: '成功',
  error: '失败',
  warning: '警告',
  info: '信息',
};
const ids = new Set<NoticeId>();
const taskId = ref<NoticeId>();
function show(status: NoticeStatus) {
  ids.add(
    ZtMessage[status]({
      title: labels[status],
      content: '经营数据已更新，可继续查看报表。',
    }),
  );
}
function persistent() {
  taskId.value = ZtMessage.open({
    id: 'feedback-import',
    status: 'info',
    content: '正在导入数据…',
    duration: 0,
    closable: false,
  });
  ids.add(taskId.value);
}
function update() {
  if (taskId.value === undefined) return;
  ZtMessage.success({
    id: taskId.value,
    content: '导入完成，共 128 条',
    duration: 0,
    closable: true,
  });
}
function close() {
  if (taskId.value !== undefined) ZtMessage.close(taskId.value);
  taskId.value = undefined;
}
onBeforeUnmount(() => ids.forEach((id) => ZtMessage.close(id)));
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton v-for="status in statuses" :key="status" @click="show(status)"
        >{{ labels[status] }}消息</ZtButton
      >
      <ZtButton @click="ids.add(ZtMessage.open('直接传入字符串'))"
        >字符串调用</ZtButton
      >
      <ZtButton
        @click="
          ZtMessage.clear();
          taskId = undefined;
        "
        >清空全部消息</ZtButton
      >
    </div>
    <div class="demo-row">
      <ZtButton @click="persistent">创建常驻消息</ZtButton>
      <ZtButton :disabled="taskId === undefined" @click="update"
        >更新为成功</ZtButton
      >
      <ZtButton :disabled="taskId === undefined" @click="close"
        >按 ID 关闭</ZtButton
      >
    </div>
    <p>
      默认顶部居中，约 3.2
      秒后消失。连续点击可观察堆叠、弹性入场、图标描边和退出后的补位。
    </p>
    <p>
      常驻示例设置 duration: 0、closable: false；更新同一 ID
      会替换内容与状态，重新计时且不重复入场。
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
