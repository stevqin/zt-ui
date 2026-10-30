<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtMessage, type NoticeId, type NoticeStatus } from "@ztechjs/zt-alert";
const result = ref("尚未发送");
const owned = new Set<NoticeId>();
function reset() {
  for (const id of owned) ZtMessage.close(id);
  owned.clear();
  result.value = "已关闭本例消息";
}
onBeforeUnmount(reset);
let current: NoticeId | undefined;
function start() {
  if (current !== undefined) ZtMessage.close(current);
  current = ZtMessage.open({
    content: "正在整理示例文件…",
    duration: 0,
    closable: true,
  });
  owned.add(current);
  result.value = "任务进行中";
}
function finish() {
  if (current === undefined || !owned.has(current)) return;
  ZtMessage.success({
    id: current,
    title: "任务完成",
    content: "已整理 12 份示例文件",
    duration: 0,
  });
  result.value = "任务已完成，消息已原位更新";
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="start">开始任务</button
      ><button @click="finish">完成并更新</button
      ><button @click="reset">关闭本例消息</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
