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

async function open() {
  if (ZtMessageBox.getState().isOpen) {
    result.value = "请先完成当前确认框";
    return;
  }
  const content = document.createElement("p");
  content.textContent = "草稿共 3 段内容，可保留后稍候继续编辑。";
  owns = true;
  const value = await ZtMessageBox({
    title: "选择后续操作",
    content,
    buttons: {
      cancel: { text: "继续编辑", value: "edit" },
      archive: { text: "保留草稿", value: "keep" },
    },
  });
  owns = false;
  result.value = `操作结果：${value ?? "已关闭"}`;
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="open">选择操作</button
      ><button @click="reset">重置</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
