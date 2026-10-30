<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtMessageBox } from "@ztechjs/zt-alert";
const result = ref("等待操作");
let owns = false;
function reset() {
  if (owns) ZtMessageBox.close();
  owns = false;
  result.value = "已重置";
}
onBeforeUnmount(reset);

async function confirm() {
  if (ZtMessageBox.getState().isOpen) {
    result.value = "请先完成当前确认框";
    return;
  }
  owns = true;
  const accepted = await ZtMessageBox.confirm({
    title: "归档示例",
    text: "是否归档当前草稿？",
  });
  owns = false;
  result.value = accepted ? "草稿已归档" : "已取消归档";
}
async function prompt() {
  if (ZtMessageBox.getState().isOpen) {
    result.value = "请先完成当前确认框";
    return;
  }
  owns = true;
  const value = await ZtMessageBox.prompt({
    title: "命名草稿",
    text: "输入一个示例名称",
  });
  owns = false;
  result.value = value === null ? "已取消输入" : `名称：${value}`;
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="confirm">归档确认</button
      ><button @click="prompt">输入名称</button
      ><button @click="reset">重置</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
