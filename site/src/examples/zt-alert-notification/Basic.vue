<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import {
  ZtNotification,
  type NoticeId,
  type NoticeStatus,
} from "@ztechjs/zt-alert";
const result = ref("尚未发送");
const owned = new Set<NoticeId>();
function reset() {
  for (const id of owned) ZtNotification.close(id);
  owned.clear();
  result.value = "已关闭本例消息";
}
onBeforeUnmount(reset);
function show(status: NoticeStatus) {
  owned.add(
    ZtNotification[status]({
      title: "处理结果",
      content: `任务状态：${status}`,
      duration: 4000,
    }),
  );
  result.value = `已发送 ${status}`;
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button
        v-for="status in ['success', 'warning', 'error', 'info'] as const"
        :key="status"
        @click="show(status)"
      >
        {{ status }}</button
      ><button @click="reset">重置本例</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
